import zerorpc


class CultiskRPC:

    def hello(self, name):
        return "Hello, %s" % name


s = zerorpc.Server(CultiskRPC())
s.bind("tcp://0.0.0.0:4242")
s.run()
