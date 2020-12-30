from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import Session
from sqlalchemy.exc import DatabaseError
import os.path
import json

from .models import Base, Password, Note


def create_session(connect_url) -> Session:
    engine = create_engine(connect_url)
    s = sessionmaker(bind=engine)
    s = s()
    return s


class Logic:

    @staticmethod
    def password_manager_start():
        output = {}
        if os.path.isfile("PasswordManager/pw_manager.db"):
            output["success"] = True
            return json.dumps(output)
        else:
            output["success"] = False
            output["error_code"] = "DB_MISSING"
            return json.dumps(output)

    @staticmethod
    def password_manager_create_db(password):
        output = {}
        url = f"sqlite+pysqlcipher://:{password}@/PasswordManager/pw_manager.db?cipher=aes-256-cfb&kdf_iter=100000"
        engine = create_engine(url)
        Base.metadata.create_all(engine)
        output["success"] = True
        return json.dumps(output)

    @staticmethod
    def password_manager_main(password):
        output = {}
        url = f"sqlite+pysqlcipher://:{password}@/PasswordManager/pw_manager.db?cipher=aes-256-cfb&kdf_iter=100000"
        session = create_session(url)
        try:
            note_result = session.query(Note).all()
            password_result = session.query(Password).all()
            note_data = []
            password_data = []
            note_row: Note
            for note_row in note_result:
                note_data.append({
                    "id": note_row.id,
                    "content": note_row.content,
                    "favorite": note_row.favorite,
                    "deleted": note_row.deleted
                })
            password_row: Password
            for password_row in password_result:
                password_data.append({
                    "id": password_row.id,
                    "username": password_row.username,
                    "password": password_row.password,
                    "totp_secret": password_row.totp_secret,
                    "favorite": password_row.favorite,
                    "deleted": password_row.deleted
                })
            output["data"] = {
                "notes": note_data,
                "passwords": password_data
            }
            output["success"] = True
            return json.dumps(output)
        except DatabaseError:
            output["error_code"] = "PASSWORD_ERR"
            output["error_message"] = "The password is wrong or the database file is corrupted"
            output["success"] = False
            return json.dumps(output)
