from time import sleep
import os
import pandas as pd
import random
import numpy as np
import json
import math
#`values` should be sorted
def get_closest(array, values):
    array = np.array(array)
    # get insert positions
    idxs = np.searchsorted(array, values, side="left")
    print " array idex ", array, idxs

    # find indexes where previous index is closer
    prev_idx_is_less = ((idxs == len(array))|(np.fabs(values - array[np.maximum(idxs-1, 0)]) < np.fabs(values - array[np.minimum(idxs, len(array)-1)])))
    idxs[prev_idx_is_less] -= 1

    return idx, array[idxs]

def find_nearest_sorted(array,value):
    idx = np.searchsorted(array, value, side="left")
    if idx > 0 and (idx == len(array) or math.fabs(value - array[idx-1]) < math.fabs(value - array[idx])):
        return idx-1, array[idx-1]
    else:
        return idx, array[idx]

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
    notDataRowKey['cluster'] = -1
    dataRowKey['cluster'] = -1
    scoreArr.sort()
    rowDict = {}
    notDataRowKeyCopy  = notDataRowKey.copy()
    print " index list ",notDataRowKey.index.tolist()

    for row in notDataRowKey.iterrows():
    # for m in range(notDataRowKey.shape[0]):
        m, rowList = row
        # rowList = notDataRowKey.iloc[int(m)]
        # print " we get i ", m, notDataRowKey.shape

        arr = np.array(rowList)
        item = [convertStr(x) for x in arr]
        score = sum(item)
        # print " in arr iterating ", i, item, score
        # index, value = find_nearest(scoreArr,score)
        index, value = find_nearest_sorted(scoreArr,score)
        # index, value = 0,444

        # index, value = get_closest(scoreArr,score)
        # print " index value ", m, index, value, score
        try:
            rowDict[rowKeys[index]].append(str(notDataRowKey['id'][m]))
        except:
            rowDict[rowKeys[index]] = [str(notDataRowKey['id'][m])]
        notDataRowKey['cluster'][m] = index


    for i in range(dataRowKey.shape[0]):
        dataRowKey['cluster'][i] = i
        try:
            rowDict[rowKeys[i]].append(str(rowKeys[i]))
        except:
            rowDict[rowKeys[i]] = [str(rowKeys[i])]
    result = pd.concat([dataRowKey, notDataRowKey])

    print " found rowdict ", rowDict



    return {'dataGiven' : result.to_dict('records'), 'indexBydata' : rowDict}





if __name__ == "__main__":

	import warnings
	warnings.filterwarnings("ignore")
