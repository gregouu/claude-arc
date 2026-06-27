from utils import count_words, reverse_string, is_palindrome


def test_count_words():
    assert count_words("hello world") == 2
    assert count_words("") == 0
    assert count_words("one") == 1
    assert count_words("   ") == 0
    assert count_words("  multiple   spaces  here  ") == 3


def test_reverse_string():
    assert reverse_string("hello") == "olleh"
    assert reverse_string("") == ""
    assert reverse_string("a") == "a"


def test_is_palindrome():
    assert is_palindrome("racecar") is True
    assert is_palindrome("hello") is False
    assert is_palindrome("A man a plan a canal Panama") is True
    assert is_palindrome("Was It A Rat I Saw") is True
    assert is_palindrome("") is True
