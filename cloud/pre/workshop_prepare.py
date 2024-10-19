# Copyright (c) 2024.
# -*-coding:utf-8 -*-
"""
@file: workshop_prepare.py
@author: Jerry(Ruihuang)Yang
@email: rxy216@case.edu
@time: 10/18/24 19:56
"""
import time


def simulate_ai_streaming_response(text):
    words = text.split()
    for word in words:
        print(word, end=' ', flush=True)
        time.sleep(0.15)  # Wait for 0.25 seconds before printing the next word


if __name__ == "__main__":
    text = "This is a simulated AI streaming response that prints one word at a time. If you can see this message coming out one word at a time, you are prepared for the workshop."
    simulate_ai_streaming_response(text)
