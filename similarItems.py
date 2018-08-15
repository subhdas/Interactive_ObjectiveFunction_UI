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

# X is the array you want to sort, Y is by the array
def sortArr_ByArray(Y,X):
    arr = [x for _,x in sorted(zip(Y,X))]
    print ' sorted arr ', arr
    return arr
    # return arr[::-1]

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
    colList = ['Acceleration','Cylinders', 'id']
    # colList = ['Displacement','Horsepower', 'id']
    data = data[colList]
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
    nonDataRowKey_mat = notDataRowKey.as_matrix()

    print "nond data row matrix ", nonDataRowKey_mat


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
        print " iterating ", i, item, scoreArr
    # for i in range(notDataRowKey.shape[0]):
    notDataRowKey['cluster'] = -1
    dataRowKey['cluster'] = -1
    scoreArr.sort()
    rowDict = {}
    rowProbDict = {}
    diffDict = {}
    notDataRowKeyCopy  = notDataRowKey.copy()
    print " index list ",notDataRowKey.index.tolist()
    # nonDataRowKey_mat = np.squeeze(np.asarray(nonDataRowKey_mat))

    # for row in notDataRowKey.iterrows():
    for m in range(notDataRowKey.shape[0]):
    # for m in range(len(nonDataRowKey_mat)):

        # m, rowList = row
        rowList = nonDataRowKey_mat[m,:]
        # rowList = notDataRowKey.iloc[int(m)]
        # print " we get i ", m, notDataRowKey.shape
        # arr = np.array(rowList)
        arr = rowList
        item = [convertStr(x) for x in arr]
        score = sum(item)

        print " in arr iterating ", m, item, score, len(nonDataRowKey_mat)

        index, value = find_nearest(scoreArr,score)
        diff = abs(value-score)

        # index, value = find_nearest_sorted(scoreArr,score)
        # index, value = 0,444

        # index, value = get_closest(scoreArr,score)
        # print " index value ", m, index, value, score
        try: diffDict[int(rowKeys[index])].append(float(diff))
        except: diffDict[int(rowKeys[index])] = [float(diff)]
        try: rowDict[int(rowKeys[index])].append(int(notDataRowKey['id'].values[m]))
        except: rowDict[int(rowKeys[index])] = [int(notDataRowKey['id'].values[m])]
        try: rowProbDict[int(rowKeys[index])].append(float(diff))
        except: rowProbDict[int(rowKeys[index])] = [float(diff)]
        notDataRowKey['cluster'][m] = index

    maxArr = []
    for i in range(dataRowKey.shape[0]):
        dataRowKey['cluster'][i] = i
        print " in row prob dict ", i, rowProbDict
        maxVal = max(rowProbDict[int(rowKeys[i])])
        try: rowDict[int(rowKeys[i])].append(int(rowKeys[i]))
        except:  rowDict[int(rowKeys[i])] = [int(rowKeys[i])]
        try: rowProbDict[int(rowKeys[i])].append(float(maxVal)+1)
        except:  rowProbDict[int(rowKeys[i])] = [float(maxVal)+1]
        maxArr.append(float(maxVal)+1)

    for i in range(dataRowKey.shape[0]):
        mx= maxArr[i]
        rowProbDict[int(rowKeys[i])] = [ round(float(x)/mx,20) for x in rowProbDict[int(rowKeys[i])]]
    # result = pd.concat([dataRowKey, notDataRowKey])

    print " found rowdict ", rowDict

    for i in range(dataRowKey.shape[0]):
        rowDict[int(rowKeys[i])] = sortArr_ByArray(diffDict[int(rowKeys[i])], rowDict[int(rowKeys[i])])
        rowProbDict[int(rowKeys[i])] = sortArr_ByArray(diffDict[int(rowKeys[i])], rowProbDict[int(rowKeys[i])])
        # diffDict[int(rowKeys[i])].sort(reverse = True)
        diffDict[int(rowKeys[i])].sort()



    return {'indexBydata' : rowDict, 'probByData' : rowProbDict, 'colSelected' : colList, 'scoreDiff' : diffDict}





if __name__ == "__main__":

	import warnings
	warnings.filterwarnings("ignore")
