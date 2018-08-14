from time import sleep
import os
import pandas as pd
import random
import numpy as np

def find_nearest(array, value):
    array = np.asarray(array)
    idx = (np.abs(array - value)).argmin()
    return idx, array[idx]


def getSimilarItems(dataObj):
    data = dataObj['data']
    selectedRows = dataObj['selectedRowIds']
    data = pd.DataFrame(data)
    # print " we get data is ", data.head(3)
    # print " selected row ids ", selectedRows
    rowKeys = selectedRows.keys()
    # print "data row key ", rowKeys
    dataRowKey = data.loc[data['id'].isin(rowKeys)]
    notDataRowKey = data.loc[~data['id'].isin(rowKeys)]
    # print "data row key ", dataRowKey
    # print "data row not key ", notDataRowKey

    dataRowKey_mat = dataRowKey.as_matrix()

    def convertStr(x):
        try:
            return float(x)
        except:
            return 0

    scoreDict = {}
    scoreArr = []
    for i in range(len(dataRowKey_mat)):
        item = dataRowKey_mat[i]
        # item = [float(x) if isinstance(x, float) else 0 for x in item]
        item = [convertStr(x) for x in item]
        # scoreDict[rowKeys[i]] = sum(item)
        scoreArr.append(sum(item))
        print " iterating ", i, item, scoreDict

    # for i in range(notDataRowKey.shape[0]):
    for row in notDataRowKey.iterrows():
        i, rowList = row
        arr = np.array(rowList)
        item = [convertStr(x) for x in arr]
        score = sum(item)
        # print " in arr iterating ", i, item, score
        index, value = find_nearest(scoreArr,score)
        print " index value ", index, value, score


    return {'a' : rowKeys}





if __name__ == "__main__":

	import warnings
	warnings.filterwarnings("ignore")
