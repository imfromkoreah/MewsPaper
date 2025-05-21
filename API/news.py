import urllib.request
import urllib.parse
import json
from datetime import datetime
import html
import re  # 추가

client_id = "yM88mDq5CBg7UDUhTr2K"
client_secret = "f4sl8gyGCS"

def format_date(pub_date_str):
    try:
        dt = datetime.strptime(pub_date_str, "%a, %d %b %Y %H:%M:%S %z")
        return f"{dt.year}년 {dt.month}월 {dt.day}일"
    except Exception:
        return pub_date_str

def remove_html_tags(text):
    clean = re.sub(r'<.*?>', '', text)
    return clean

def fetch_news(category_keyword, display=10, start=1, sort='date'):
    query = urllib.parse.quote(category_keyword)
    url = f"https://openapi.naver.com/v1/search/news.json?query={query}&display={display}&start={start}&sort={sort}"
    request = urllib.request.Request(url)
    request.add_header("X-Naver-Client-Id", client_id)
    request.add_header("X-Naver-Client-Secret", client_secret)

    try:
        response = urllib.request.urlopen(request)
        rescode = response.getcode()
        if rescode == 200:
            response_body = response.read()
            json_data = json.loads(response_body.decode('utf-8'))
            return json_data.get('items', [])
        else:
            print(f"Error Code: {rescode}")
            return []
    except Exception as e:
        print(f"오류 발생: {e}")
        return []

politics_news = fetch_news("정치", display=2)
entertainment_news = fetch_news("연예", display=2)

print("정치 뉴스:")
for news in politics_news:
    date_formatted = format_date(news['pubDate'])
    title = html.unescape(news['title'])
    title = remove_html_tags(title)  # 제목 태그 제거
    description = html.unescape(news['description'])
    description = remove_html_tags(description)  # 설명 태그 제거

    description = remove_html_tags(description)  # 태그 제거
    print(f"- 제목: {title}")
    print(f"  날짜: {date_formatted}")
    print(f"  요약: {description}")
    print()

print("\n연예 뉴스:")
for news in entertainment_news:
    date_formatted = format_date(news['pubDate'])
    title = html.unescape(news['title'])
    title = remove_html_tags(title)  
    description = html.unescape(news['description'])
    description = remove_html_tags(description)  
    print(f"- 제목: {title}")
    print(f"  날짜: {date_formatted}")
    print(f"  요약: {description}")
    print()
