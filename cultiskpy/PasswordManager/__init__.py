from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import Session


from .models import Base, Password, Note

DB_PATH = "sqlite:///PasswordManager/pw_manager.db"


def create_session() -> Session:
    engine = create_engine(DB_PATH)
    s = sessionmaker(bind=engine)
    s = s()
    return s


def init_db() -> Session:
    engine = create_engine(DB_PATH)
    Base.metadata.create_all(engine)
    s = sessionmaker(bind=engine)
    s = s()
    return s
