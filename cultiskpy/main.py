import zerorpc
from SoftwareUpdater import Logic as SoftwareRPC


class CultiskRPC(SoftwareRPC):

    def __init__(self):
        super(CultiskRPC, self).__init__()


print("Server started on localhost:4242")
print("URI: tcp://localhost:4242")
print("LOG")
s = zerorpc.Server(CultiskRPC(), pool_size=7)
s.bind("tcp://0.0.0.0:4242")
s.run()
