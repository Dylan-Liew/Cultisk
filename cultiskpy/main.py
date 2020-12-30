import zerorpc
from PasswordManager import Logic as PasswordRPC


class TestRPC:

    def hello(self, name):
        return "Hello, %s" % name


class CultiskRPC(TestRPC, PasswordRPC):

    def __init__(self):
        super(CultiskRPC, self).__init__()


s = zerorpc.Server(CultiskRPC(), pool_size=7)
s.bind("tcp://0.0.0.0:4242")
s.run()
