export type Lesson = {
  day: number
  title: string
  topics: string[]
  theory: string
  challenge: { prompt: string; starter: string; solution: string; testCases: string[] }
  hints: string[]
  points: number
}

export const CURRICULUM: Lesson[] = [
  {
    day: 1, title: "Python Basics & Data Types", points: 100,
    topics: ["Variables", "Data Types", "is vs ==", "Mutable vs Immutable"],
    theory: `# Day 1 — Python Basics

Python có 7 kiểu dữ liệu cơ bản:
\`\`\`python
int, float, str, bool, list, dict, tuple, set, None
\`\`\`

## Mutable vs Immutable
- **Immutable**: int, float, str, tuple, bool → không thể thay đổi sau khi tạo
- **Mutable**: list, dict, set → có thể thay đổi

## is vs ==
- \`==\` so sánh **giá trị**
- \`is\` so sánh **identity** (cùng object trong RAM?)

\`\`\`python
a = [1, 2, 3]
b = [1, 2, 3]
a == b  # True  — cùng giá trị
a is b  # False — khác object
\`\`\``,
    challenge: {
      prompt: "Viết function `type_info(value)` trả về dict chứa: type name, is_mutable, is_none",
      starter: `def type_info(value):
    # TODO: trả về dict với keys: type_name, is_mutable, is_none
    pass

# Test
print(type_info(42))        # {'type_name': 'int', 'is_mutable': False, 'is_none': False}
print(type_info([1,2,3]))   # {'type_name': 'list', 'is_mutable': True, 'is_none': False}
print(type_info(None))      # {'type_name': 'NoneType', 'is_mutable': False, 'is_none': True}`,
      solution: `def type_info(value):
    mutable_types = (list, dict, set)
    return {
        'type_name': type(value).__name__,
        'is_mutable': isinstance(value, mutable_types),
        'is_none': value is None
    }`,
      testCases: ["type_info(42)['type_name'] == 'int'", "type_info([])['is_mutable'] == True", "type_info(None)['is_none'] == True"]
    },
    hints: [
      "Dùng type(value).__name__ để lấy tên kiểu",
      "Dùng isinstance(value, (list, dict, set)) để check mutable",
      "Dùng value is None để check None"
    ]
  },
  {
    day: 2, title: "Strings & String Methods", points: 100,
    topics: ["String methods", "f-strings", "Slicing", "join vs +"],
    theory: `# Day 2 — Strings

## String là immutable
\`\`\`python
s = "hello"
# s[0] = "H"  # ❌ TypeError
s = "H" + s[1:]  # ✅ tạo string mới
\`\`\`

## f-strings (Python 3.6+)
\`\`\`python
name, age = "Vuong", 25
print(f"Name: {name}, Age: {age}")
print(f"{3.14159:.2f}")   # 3.14
\`\`\`

## join vs + (performance)
\`\`\`python
# ❌ O(n²) — tạo string mới mỗi lần
result = ""
for word in words:
    result += word

# ✅ O(n) — chỉ 1 lần allocate
result = " ".join(words)
\`\`\``,
    challenge: {
      prompt: "Viết function `is_palindrome(s)` kiểm tra chuỗi có phải palindrome không (bỏ qua space và case)",
      starter: `def is_palindrome(s: str) -> bool:
    # TODO: bỏ space, lowercase, rồi so sánh với reverse
    pass

print(is_palindrome("racecar"))                    # True
print(is_palindrome("A man a plan a canal Panama")) # True
print(is_palindrome("hello"))                      # False`,
      solution: `def is_palindrome(s: str) -> bool:
    s = s.lower().replace(" ", "")
    return s == s[::-1]`,
      testCases: ["is_palindrome('racecar') == True", "is_palindrome('hello') == False", "is_palindrome('A man a plan a canal Panama') == True"]
    },
    hints: ["Dùng .lower() để lowercase", "Dùng .replace(' ', '') để bỏ space", "Dùng [::-1] để reverse string"]
  },
  {
    day: 3, title: "Lists & List Operations", points: 100,
    topics: ["List methods", "Comprehension", "Slicing", "sorted vs sort"],
    theory: `# Day 3 — Lists

## Khác biệt sorted() vs .sort()
\`\`\`python
nums = [3, 1, 4, 1, 5]
sorted(nums)  # tạo list MỚI, không đổi original
nums.sort()   # sửa IN-PLACE, return None
\`\`\`

## List Comprehension
\`\`\`python
# Thay vì:
squares = []
for n in range(10):
    if n % 2 == 0:
        squares.append(n**2)

# Dùng:
squares = [n**2 for n in range(10) if n % 2 == 0]
\`\`\`

## Looping Problem
\`\`\`python
# ❌ ĐỪNG xóa item khi đang loop
for item in lst:
    lst.remove(item)   # bug!

# ✅ Dùng comprehension
lst = [x for x in lst if condition]
\`\`\``,
    challenge: {
      prompt: "Viết function `flatten(nested)` làm phẳng list lồng nhau bất kỳ độ sâu",
      starter: `def flatten(nested: list) -> list:
    # TODO: flatten list lồng nhau
    pass

print(flatten([1, [2, 3], [4, [5, 6]]]))     # [1, 2, 3, 4, 5, 6]
print(flatten([[1, [2]], [3, [4, [5]]]]))      # [1, 2, 3, 4, 5]
print(flatten([1, 2, 3]))                      # [1, 2, 3]`,
      solution: `def flatten(nested: list) -> list:
    result = []
    for item in nested:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result`,
      testCases: ["flatten([1,[2,3]]) == [1,2,3]", "flatten([[1,[2]],[3]]) == [1,2,3]"]
    },
    hints: ["Dùng isinstance(item, list) để check", "Dùng recursion cho list lồng nhau", "result.extend() thêm nhiều items cùng lúc"]
  },
  {
    day: 4, title: "Dictionaries & Sets", points: 100,
    topics: ["Dict methods", "defaultdict", "Counter", "Set operations"],
    theory: `# Day 4 — Dict & Set

## Dict hay dùng
\`\`\`python
d = {"a": 1}
d.get("missing", 0)      # 0 — không throw KeyError
d.setdefault("b", []).append(1)  # tạo key nếu chưa có
{**d1, **d2}             # merge dicts
\`\`\`

## defaultdict
\`\`\`python
from collections import defaultdict
scores = defaultdict(list)
scores["Alice"].append(90)  # không cần init key
\`\`\`

## Counter
\`\`\`python
from collections import Counter
c = Counter(["a","b","a","c","a","b"])
c.most_common(2)  # [('a', 3), ('b', 2)]
\`\`\`

## Set operations
\`\`\`python
a & b  # intersection
a | b  # union
a - b  # difference
\`\`\``,
    challenge: {
      prompt: "Viết function `word_frequency(text)` đếm tần suất từ, trả về top 3 từ xuất hiện nhiều nhất",
      starter: `def word_frequency(text: str) -> list[tuple]:
    # TODO: đếm từ, trả về top 3 dạng [(word, count), ...]
    pass

text = "the quick brown fox jumps over the lazy dog the fox"
print(word_frequency(text))  # [('the', 3), ('fox', 2), ('quick', 1)] hoặc tương tự`,
      solution: `from collections import Counter

def word_frequency(text: str) -> list[tuple]:
    words = text.lower().split()
    return Counter(words).most_common(3)`,
      testCases: ["word_frequency('a a b b b c')[0] == ('b', 3)"]
    },
    hints: ["Dùng text.split() để tách từ", "Dùng Counter từ collections", "Counter.most_common(3) lấy top 3"]
  },
  {
    day: 5, title: "Functions & Arguments", points: 150,
    topics: ["*args", "**kwargs", "Positional-only /", "Keyword-only *", "Default mutable gotcha"],
    theory: `# Day 5 — Functions & Arguments

## Thứ tự arguments
\`\`\`python
def func(pos_only, /, regular, *args, kw_only, **kwargs):
    pass
\`\`\`

## *args và **kwargs
\`\`\`python
def log(level, *messages):        # *args → tuple
    for msg in messages: print(f"[{level}] {msg}")

def config(**kwargs):              # **kwargs → dict
    print(kwargs)
\`\`\`

## ⚠️ Mutable default — classic bug
\`\`\`python
def bad(lst=[]):        # [] tạo 1 lần!
    lst.append(1)
    return lst

bad()  # [1]
bad()  # [1, 1]  ← bug!

def good(lst=None):     # fix
    if lst is None: lst = []
    lst.append(1)
    return lst
\`\`\``,
    challenge: {
      prompt: "Viết function `merge_dicts(*dicts, **overrides)` merge nhiều dicts, overrides có priority cao nhất",
      starter: `def merge_dicts(*dicts, **overrides):
    # TODO: merge tất cả dicts, rồi apply overrides
    pass

d1 = {"a": 1, "b": 2}
d2 = {"b": 3, "c": 4}
print(merge_dicts(d1, d2, b=99))  # {'a': 1, 'b': 99, 'c': 4}`,
      solution: `def merge_dicts(*dicts, **overrides):
    result = {}
    for d in dicts:
        result.update(d)
    result.update(overrides)
    return result`,
      testCases: ["merge_dicts({'a':1},{'b':2})['a'] == 1", "merge_dicts({'a':1},{'a':2},a=99)['a'] == 99"]
    },
    hints: ["Dùng dict.update() để merge", "Loop qua *dicts trước", "Cuối cùng update với **overrides để override"]
  },
]

// Thêm placeholder cho ngày 6-25
for (let day = 6; day <= 25; day++) {
  CURRICULUM.push({
    day, title: `Day ${day} — Coming Soon`, points: 100,
    topics: ["Topic 1", "Topic 2"],
    theory: `# Day ${day}\n\nContent coming soon...`,
    challenge: {
      prompt: "Challenge coming soon",
      starter: "# Your code here\npass",
      solution: "pass",
      testCases: []
    },
    hints: ["Hint 1", "Hint 2"]
  })
}
