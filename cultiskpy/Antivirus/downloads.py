from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler, LoggingEventHandler


class AVHandler(FileSystemEventHandler):
    def on_created(self, event):
        print("on_created", event.src_path)


event_handler = AVHandler()
observer = Observer()
observer.schedule(event_handler, path='C:\\Users\\IEUser\\Downloads', recursive=False)
observer.start()

while True:
    try:
        pass
    except KeyboardInterrupt:
        observer.stop()

