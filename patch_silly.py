import re

with open('curriculum-app/src/components/RandomTopicGenerator.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_silly = """const DEBATE_TOPICS_SILLY = [
  "Is a hot dog a sandwich?",
  "Does pineapple belong on pizza?",
  "Would you rather fight one horse-sized duck or 100 duck-sized horses?",
  "Is cereal technically soup?",
  "Should we legally ban the snooze button on alarms?",
  "If you drop food on the floor and pick it up in 5 seconds, is it safe to eat?",
  "Are aliens currently hiding on Earth?",
  "Should everyone be forced to wear a uniform every day?",
  "Should we abolish morning classes before 10 AM?",
  "Is water actually wet?"
];"""

new_silly = """const DEBATE_TOPICS_SILLY = [
  "Is a hot dog a sandwich?",
  "Does pineapple belong on pizza?",
  "Would you rather fight one horse-sized duck or 100 duck-sized horses?",
  "Is cereal technically soup?",
  "Should we legally ban the snooze button on alarms?",
  "If you drop food on the floor and pick it up in 5 seconds, is it safe to eat?",
  "Are aliens currently hiding on Earth?",
  "Should everyone be forced to wear a uniform every day?",
  "Should we abolish morning classes before 10 AM?",
  "Is water actually wet?",
  "Does a straw have one hole or two?",
  "If a tomato is a fruit, is ketchup a smoothie?",
  "Is Die Hard a Christmas movie?",
  "Should it be a crime to put milk in the bowl before the cereal?",
  "Are hot dogs just American tacos?",
  "Should toilet paper hang over or under the roll?",
  "Is it acceptable to wear socks with sandals?",
  "Should brushing your teeth be done before or after breakfast?",
  "Is Batman actually a superhero if he has no superpowers?",
  "Are ghosts real or just bad eyesight?",
  "Which is a superior pet: a dog that acts like a cat, or a cat that acts like a dog?",
  "Should we permanently replace handshakes with fist bumps?",
  "Do fish get thirsty?",
  "Is a thumb technically a finger?",
  "Should humans sleep in pods instead of beds?"
];"""

if old_silly in content:
    content = content.replace(old_silly, new_silly)
    with open('curriculum-app/src/components/RandomTopicGenerator.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Success")
else:
    print("Could not find the old silly topics block")
