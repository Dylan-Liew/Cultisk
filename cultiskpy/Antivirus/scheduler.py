import schedule
import time


def geeks():
    print("Geeksforgeeks")


schedule.every(2).seconds.do(geeks)
while True:
    # Checks whether a scheduled task
    # is pending to run or not
    schedule.run_pending()
    time.sleep(1)

