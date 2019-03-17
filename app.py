



from time import sleep
import os
import copy
from flask_socketio import SocketIO, send, emit
from flask_sockets import Sockets
import pandas as pd
from flask import Flask, render_template, jsonify
from flask import request
from sklearn import svm
import random
import simplejson as json
import ast
import itertools
import numpy as np
from sklearn.model_selection import cross_val_score
import timeit
from timeit import default_timer as timer
from sklearn.model_selection import train_test_split

from similarItems import getSimilarItems
from hyperOpt_optimize import wrap_findGoodModel




from Queue import Queue
from threading import Thread


app = Flask(__name__)
app.debug = 'DEBUG' in os.environ
socketio = SocketIO(app)






def preprocess_data(dataGiven):
	# print "preprocessing in python ", len(dataIn)

	dataIn = dataGiven['data']
	# targetCol = dataGiven['targetName']
	inp_df = pd.DataFrame(dataIn)
	inp_df['cluster'] = 0
	orig_df = inp_df.fillna(0)
	v = 40*6
	inp_df = orig_df[0:v]
	app_df = orig_df[v:orig_df.shape[0] - 1]
	app_df['id'] = [i for i in range(app_df.shape[0])]
	inp_df['id'] = [i for i in range(inp_df.shape[0])]
	train, test = train_test_split(inp_df, test_size=0.35)
	print " after split ", train.shape, test.shape


	# train_Y = train.ix[:, [targetCol]]
	# test_Y = test.ix[:, [targetCol]]

	# train_X = train.drop([targetCol], axis=1)
	# test_X = test.drop([targetCol], axis=1)
	# app_df = app_df.drop([targetCol], axis=1)

	app_df_dict = app_df.to_dict('records')
	train_X_dict = train.to_dict('records')
	test_X_dict = test.to_dict('records')
	# train_Y_dict = train_Y.to_dict('records')
	# test_Y_dict = test_Y.to_dict('records')
	# return [train_X_dict, train_Y_dict, test_X_dict, test_Y_dict, app_df_dict]
	return [train_X_dict, test_X_dict, app_df_dict]






# @app.route("/", methods=['GET', 'POST'])
# @app.route('/index', methods=['GET', 'POST'])
@app.route("/")
def index():
	return render_template('index.html')




# socket func+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
@socketio.on('client_connected')
def handle_client_connect_event(json):
    print('received json: {0}'.format(str(json)))


@socketio.on('data_preprocess')
def handle_my_custom_event(data):
	out = preprocess_data(data)
	emit('data_return_preprocess', out)


@socketio.on('find_similarData')
def handle_my_custom_event(data):
	print " gotten item ++++++++++++++++++++++++++++++++++++++++++ "
	obj = {}
	found = False
	while(not found):
		try:
			obj = getSimilarItems(data)
			found = True
		except:
			found = False
	emit('similarData_return', obj)


@socketio.on('find_recommend')
def handle_my_custom_event(data):
	out = get_clustering(data)
	# print " we get out ", out
	emit('on_recommend_recieve', out)

@socketio.on('get_good_model')
def handle_my_custom_event(data):
	print " request to get good model"
	metricList = data['metrics']
	metricKeys = data['metricKeys']
	userConsWts = data['userConsWts']
	train = data['train']
	train = pd.DataFrame(train)
	train = train.drop(['predicted'], axis = 1)
	targetCol = data['targetCol']

	test = data['test']
	test = pd.DataFrame(test)
	test = test.drop(['predicted'], axis=1)

	print "train and targetCol ", train.head(3)
	print "train and targetCol ", targetCol, train.columns.values
	targetTrain = train[str(targetCol)]
	targetTest = test[str(targetCol)]
	# target = ''
	train.drop([targetCol], axis=1)
	test.drop([targetCol], axis=1)


	extraInfo = {
        'metricList': metricList,
		'metricKeys': metricKeys,
		'highWeights': userConsWts
    }
	out = wrap_findGoodModel(train,test, targetTrain,targetTest, extraInfo)
	# print " we get out ", out
	emit('send_good_model', out)

# socket func+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


if __name__ == "__main__":

	import warnings
	warnings.filterwarnings("ignore")

	# app.debug = True
	# port = int(os.environ.get("PORT", 7000))
	# app.run(host = '0.0.0.0', port = port)
	# socketio.run(app, 7000, debug = True)
	# socketio.run(app, host='localhost', port=7000)
	socketio.run(app, debug=True)
	# socketio.run(app)
