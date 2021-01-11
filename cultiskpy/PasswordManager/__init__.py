from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import Session
from sqlalchemy.exc import DatabaseError
import os.path
import json

from .models import Base, Password, Note, Card


def gen_connect_url(password: str, cipher="aes-256-cfb", kdf_iter=100000) -> str:
    return f"sqlite+pysqlcipher://:{password}@/PasswordManager/pw_manager.db?cipher={cipher}&kdf_iter={kdf_iter}"


class Logic:

    password = None

    def _open_session(self, input_password=None) -> Session:
        if self.__class__.password is not None:
            password = self.__class__.password
        else:
            password = input_password
        url = gen_connect_url(password)
        engine = create_engine(url)
        s = sessionmaker(bind=engine)
        s = s()
        return s

    @staticmethod
    def password_manager_start():
        print("< <Password Manager> launched")
        output = {}
        if os.path.isfile("PasswordManager/pw_manager.db"):
            output["success"] = True
        else:
            output["success"] = False
            output["error_code"] = "DB_MISSING"
            print("> Database missing!")
        print(f"> {output}")
        return json.dumps(output)

    def password_manager_create_db(self, password):
        print("< <Password Manager> create new database")
        self.__class__.password = password
        output = {}
        url = gen_connect_url(password)
        engine = create_engine(url)
        Base.metadata.create_all(engine)
        output["success"] = True
        print(f"> {output}")
        return json.dumps(output)

    def password_manager_main(self, password):
        print("< <Password Manager> Decrypt database")
        output = {}
        session = self._open_session(password)
        try:
            note_result = session.query(Note).all()
            card_result = session.query(Card).all()
            password_result = session.query(Password).all()
            self.__class__.password = password
            note_data = []
            password_data = []
            card_data = []
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
                    "url": password_row.url,
                    "deleted": password_row.deleted
                })
            card_row: Card
            for card_row in card_result:
                card_data.append({
                    "id": card_row.id,
                    "number": card_row.number,
                    "ccv": card_row.ccv,
                    "expiry_moth": card_row.expiry_month,
                    "expiry_year": card_row.expiry_year,
                    "favorite": card_row.favorite,
                    "deleted": card_row.deleted
                })
            output["data"] = {
                "notes": note_data,
                "passwords": password_data,
                "cards": card_data
            }
            output["success"] = True
            print("> Decryption OK")
        except DatabaseError:
            output["error_code"] = "PASSWORD_ERR"
            output["error_message"] = "The password is wrong or the database file is corrupted"
            output["success"] = False
            print(f"> Decryption Failed")
        session.close()
        print(f"> {output}")
        return json.dumps(output)

    def _create_entry(self, obj, data):
        session = self._open_session()
        n_obj = obj(**data)
        session.add(n_obj)
        session.commit()
        data["id"] = n_obj.id
        session.close()
        return data

    def create_password_entry(self, data):
        print("< <Password Manager> Create Password entry")
        output = {}
        data = json.loads(data)
        data = self._create_entry(Password, data)
        output["success"] = True
        output["data"] = data
        print(f"> Entry created {output}")
        return json.dumps(output)

    def create_note_entry(self, data):
        print("< <Password Manager> Create Note entry")
        output = {}
        data = json.loads(data)
        data = self._create_entry(Note, data)
        output["success"] = True
        output["data"] = data
        print(f"> Entry created {output}")
        return json.dumps(output)

    def create_card_entry(self, data):
        print("< <Password Manager> Create Card entry")
        output = {}
        data = json.loads(data)
        data = self._create_entry(Card, data)
        output["success"] = True
        output["data"] = data
        print(f"> Entry created {output}")
        return json.dumps(output)

    def _edit_entry(self, obj, data):
        session = self._open_session()
        c_obj = session.query(obj).filter(id=int(data["id"]))
        del data["id"]
        for key in data:
            setattr(c_obj, key.lower(), data.get(key.lower()))
        session.commit()
        session.close()
        return True

    def edit_card_entry(self, data):
        print("< <Password Manager> Edit Card entry")
        data = json.loads(data)
        output = {
            "data": data
        }
        if self._edit_entry(Card, data):
            output["success"] = True
        print(f"> Entry edited {output}")
        return json.dumps(output)

    def edit_password_entry(self, data):
        print("< <Password Manager> Edit Password entry")
        data = json.loads(data)
        output = {
            "data": data
        }
        if self._edit_entry(Password, data):
            output["success"] = True
        print(f"> Entry edited {output}")
        return json.dumps(output)

    def edit_note_entry(self, data):
        print("< <Password Manager> Edit Note entry")
        data = json.loads(data)
        output = {
            "data": data
        }
        if self._edit_entry(Note, data):
            output["success"] = True
        print(f"> Entry edited {output}")
        return json.dumps(output)

    def _delete_entry(self, obj, data):
        session = self._open_session()
        c_obj = session.query(obj).filter(id=int(data["id"]))
        c_obj.deleted = True
        session.commit()
        session.close()
        return True

    def delete_card_entry(self, data):
        print("< <Password Manager> Delete Card entry")
        data = json.loads(data)
        output = {
            "deleted": True
        }
        if self._delete_entry(Card, data):
            output["success"] = True
        print(f"> Entry deleted")
        return json.dumps(output)

    def delete_password_entry(self, data):
        print("< <Password Manager> Delete Password entry")
        data = json.loads(data)
        output = {
            "deleted": True
        }
        if self._delete_entry(Password, data):
            output["success"] = True
        print(f"> Entry deleted")
        return json.dumps(output)

    def delete_note_entry(self, data):
        print("< <Password Manager> Delete Note entry")
        data = json.loads(data)
        output = {
            "deleted": True
        }
        if self._delete_entry(Note, data):
            output["success"] = True
        print(f"> Entry deleted")
        return json.dumps(output)

