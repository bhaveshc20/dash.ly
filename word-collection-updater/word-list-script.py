import requests
import json
import re


def add_words(word_length, good_words):
	offset = 0
	results_length = -1
	print "word length %s" % word_length

	print "results Length %s" % results_length
	while results_length == 5000 or results_length < 0:
		print "offset " + str(offset)
		url = 'https://od-api.oxforddictionaries.com:443/api/v1/wordlist/' + language + '/lexicalCategory=noun;regions=us?offset=%s&word_length=%s' % (offset, word_length)

		r = requests.get(url, headers = {'app_id': app_id, 'app_key': app_key})
		"""
		print("code {}\n".format(r.status_code))
		print("text \n" + r.text)
		print("json \n" + json.dumps(r.json()))

		"""
		try:
			data = r.json()['results']
		except Exception as e:
			print 'failed to load json'
		results_length = len(data)				

		for item in data:
			if not any(bad_letter in item['word'] for bad_letter in bad_letters):
				if re.match("^[a-zA-Z]*", item['word']):
					try:
						item['word'].decode('ascii')
						good_words.append(item['word'])
					except Exception as e:
						print 'not ascii code'

	
		print good_words
		offset += 5000
		#Inner Loop Level


# TODO: replace with your own app_id and app_key
app_id = '6574670f'
app_key = 'a3f343d661e7420507f0ac7b44425d50'

language = 'en'

#url = 'https://od-api.oxforddictionaries.com:443/api/v1/regions/' + language 
good_words = []
word_length = 4
bad_letters = ["'", "$", '&', '%', '!', '@', '"', '.', ',', '/', " ", "-"]

while word_length < 9:
	add_words(word_length, good_words)
	word_length += 1

add_words(15, good_words)

jsondata = json.dumps(good_words)
with open('static/data.json', 'w') as json_file:
	json_file.write(jsondata)

