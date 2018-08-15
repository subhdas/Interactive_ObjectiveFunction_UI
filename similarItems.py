from time import sleep
import os
import pandas as pd
import random
import numpy as np
import json
import math
from sklearn.feature_selection import VarianceThreshold

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

def remove_categorical(X):
    X = X.apply(pd.to_numeric, errors='ignore')
    return X._get_numeric_data()


def findFeatures_byVariance(x):
    id = x['id']
    finalColList = []
    train = x.copy()
    train = remove_categorical(train)
    selector = VarianceThreshold()
    selector.fit_transform(train)
    col = train.columns.values
    var = selector.variances_
    col_sorted = [m for _, m in sorted(zip(var, col))]
    print " variance obtained " , len(var), len(col), var
    print " variance cols ", col
    print " variance cols sorted ", col_sorted, sorted(var)
    # finalColList = col_sorted[0:4]
    num = random.randint(1,len(col_sorted)-1)
    finalColList = col_sorted[-1*num:]

    # fin = x[finalCol]
    # fin['target_variable'] = tar
    print " ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ "
    fin = x[finalColList]

    fin['id'] = id
    print " we have finalCol ", finalColList
    return fin, finalColList

def getSimilarItems(dataObj):
    data = dataObj['data']
    selectedRows = dataObj['selectedRowIds']
    data = pd.DataFrame(data)
    # data, colList = findFeatures_byVariance(data)
    colList = data.columns.values.tolist()
    try: colList.remove('id')
    except : pass
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
        try:  return float(x)
        except: return 0

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
    rowProbDict = {}
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
        index, value = find_nearest(scoreArr,score)
        diff = abs(value-score)
        # index, value = find_nearest_sorted(scoreArr,score)
        # index, value = 0,444

        # index, value = get_closest(scoreArr,score)
        # print " index value ", m, index, value, score
        try: rowDict[rowKeys[index]].append(str(notDataRowKey['id'][m]))
        except: rowDict[rowKeys[index]] = [str(notDataRowKey['id'][m])]
        try: rowProbDict[rowKeys[index]].append(float(diff))
        except: rowProbDict[rowKeys[index]] = [float(diff)]
        notDataRowKey['cluster'][m] = index

    maxArr = []
    for i in range(dataRowKey.shape[0]):
        dataRowKey['cluster'][i] = i
        maxVal = max(rowProbDict[rowKeys[i]])
        try: rowDict[rowKeys[i]].append(str(rowKeys[i]))
        except:  rowDict[rowKeys[i]] = [str(rowKeys[i])]
        try: rowProbDict[rowKeys[i]].append(float(maxVal)+1)
        except:  rowProbDict[rowKeys[i]] = [float(maxVal)+1]
        maxArr.append(float(maxVal)+1)

    for i in range(dataRowKey.shape[0]):
        mx= maxArr[i]
        rowProbDict[rowKeys[i]] = [ round(float(x)/mx,3) for x in rowProbDict[rowKeys[i]]]
    result = pd.concat([dataRowKey, notDataRowKey])

    print " found rowdict ", rowDict



    return {'dataGiven' : result.to_dict('records'), 'indexBydata' : rowDict, 'probByData' : rowProbDict, 'colSelected' : colList}





if __name__ == "__main__":

	import warnings
	warnings.filterwarnings("ignore")
