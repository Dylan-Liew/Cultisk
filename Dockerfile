FROM python:3.8.7

WORKDIR /cultiskpy

COPY ./cultiskpy/requirements.txt .

RUN apt update
RUN apt-get install sqlcipher libsqlcipher0 libsqlcipher-dev
RUN pip3 install -r requirements.txt

COPY ./cultiskpy .

EXPOSE 4242

CMD ["python", "main.py"]