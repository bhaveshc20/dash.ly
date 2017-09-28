from flask import Flask, render_template, json, jsonify
import os


app = Flask(__name__)


@app.route("/")
def main():
    #Get 10 Recipe's render them on home page
    return render_template("index.html")

@app.route("/data.json", methods=["GET"])
def getData():
	data = None
	filename = os.path.join(app.static_folder, 'data.json')

	with open(filename) as blog_file:
		data = json.load(blog_file)
		print 'da data'
	return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)