"""Replace the current DocLevel administrator with a single new administrator."""

from __future__ import annotations

import getpass
import os
import re
import sys
from pathlib import Path

import bcrypt
import dns.resolver
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import PyMongoError


PROJECT_ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = PROJECT_ROOT / ".env.local"
EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")

# Avoid ISP/router resolvers that reject MongoDB Atlas SRV lookups.
public_resolver = dns.resolver.Resolver(configure=False)
public_resolver.nameservers = ["1.1.1.1", "8.8.8.8"]
dns.resolver.default_resolver = public_resolver


def ask_email(label: str) -> str:
    email = input(label).strip().lower()
    if not EMAIL_PATTERN.fullmatch(email):
        raise ValueError("El correo no tiene un formato válido.")
    return email


def ask_password() -> str:
    password = getpass.getpass("Nueva contraseña (mínimo 12 caracteres): ")
    if len(password) < 12:
        raise ValueError("La contraseña debe contener al menos 12 caracteres.")

    confirmation = getpass.getpass("Confirma la nueva contraseña: ")
    if password != confirmation:
        raise ValueError("Las contraseñas no coinciden.")
    return password


def main() -> int:
    if not ENV_FILE.exists():
        print(f"No se encontró {ENV_FILE}.", file=sys.stderr)
        return 1

    load_dotenv(ENV_FILE)
    mongo_url = os.getenv("MONGO_URL") or os.getenv("MONGODB_URI")
    db_name = os.getenv("DB_NAME", "DocLevel")

    if not mongo_url:
        print("Falta MONGO_URL o MONGODB_URI en .env.local.", file=sys.stderr)
        return 1

    try:
        current_email = ask_email("Correo del administrador actual: ")
        new_email = ask_email("Correo del administrador nuevo: ")
        new_password = ask_password()
    except (EOFError, KeyboardInterrupt):
        print("\nOperación cancelada.")
        return 1
    except ValueError as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1

    print("\nSe realizará lo siguiente:")
    print(f"- Cambiar {current_email} por {new_email}")
    print("- Reemplazar la contraseña")
    print("- Eliminar cualquier otro administrador de la colección admins")
    confirmation = input("Escribe CAMBIAR para continuar: ").strip()
    if confirmation != "CAMBIAR":
        print("Operación cancelada. No se realizaron cambios.")
        return 0

    client = MongoClient(
        mongo_url,
        serverSelectionTimeoutMS=8000,
        connectTimeoutMS=8000,
    )

    try:
        client.admin.command("ping")
        admins = client[db_name]["admins"]
        current_admin = admins.find_one({"email": current_email})

        if current_admin is None:
            print(
                f"No existe un administrador con el correo {current_email}.",
                file=sys.stderr,
            )
            return 1

        duplicate = admins.find_one(
            {"email": new_email, "_id": {"$ne": current_admin["_id"]}}
        )
        if duplicate is not None:
            print(
                "El correo nuevo ya pertenece a otro administrador. "
                "No se realizaron cambios.",
                file=sys.stderr,
            )
            return 1

        password_hash = bcrypt.hashpw(
            new_password.encode("utf-8"), bcrypt.gensalt(rounds=12)
        ).decode("utf-8")

        update_result = admins.update_one(
            {"_id": current_admin["_id"]},
            {
                "$set": {
                    "email": new_email,
                    "password": password_hash,
                }
            },
        )
        if update_result.matched_count != 1:
            print("No se pudo actualizar el administrador.", file=sys.stderr)
            return 1

        delete_result = admins.delete_many({"_id": {"$ne": current_admin["_id"]}})
        print("\nAdministrador actualizado correctamente.")
        print(f"Correo activo: {new_email}")
        print(f"Administradores anteriores eliminados: {delete_result.deleted_count}")
        print("La contraseña no fue guardada ni mostrada por el script.")
        return 0
    except PyMongoError as error:
        print(f"Error de MongoDB: {error}", file=sys.stderr)
        return 1
    finally:
        client.close()


if __name__ == "__main__":
    raise SystemExit(main())
