import random
from sklearn.metrics import classification_report, f1_score, accuracy_score, confusion_matrix, precision_score, recall_score
from sklearn.model_selection import train_test_split, cross_val_score

# CONSTRAINTS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
# dict = {'z_id' : 'label_id'}
def critical_metrics_key(origTrainDict,predTrainDict):
    data_id = []
    score = random.random()
    # print('orig train dict ', origTrainDict)    
    return score


def cand_metrics_key(origTrainDict, predTrainDict):
    score = random.random()
    weight_list=[]
    data_id = []
    return score

# should be specified in pairs of data item ids
def similar_diff_metrics_key(origTrainDict, predTrainDict):
    score = random.random()
    data_id = []
    return score

# targetTrain = list of orig labels, predTrain = list of predicted labels
def precision_metric_key(targetTrain, predTrain):
    score = random.random()
    return score


def recall_metric_key(targetTrain, predTrain):
    score = random.random()
    return score        


def f1score_metric_key(targetTrain, predTrain):
    score = random.random()
    return score


def acc_metric_key(targetTrain, predTrain):
    score = random.random()
    return score


def crossval_metric_key(clf, train, targetTrain):
    score = random.random()
    return score

# CONSTRAINTS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



if __name__ == "__main__":

    import warnings
    warnings.filterwarnings("ignore")
