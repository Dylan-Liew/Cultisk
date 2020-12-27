from PasswordManager import Password, Note
from PasswordManager import init_db as init_pw_db


def pw_manager_init():
    session = init_pw_db()
    pw_entry1 = Password("lol.com", "password")
    pw_entry2 = Password("wtf.com", "password", "cgi1c23")
    note_entry = Note("JS is a messy language")
    session.add(pw_entry2)
    session.add(pw_entry1)
    session.add(note_entry)
    session.commit()


pw_manager_init()
