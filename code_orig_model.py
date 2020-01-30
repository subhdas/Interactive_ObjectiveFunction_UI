import random
from sklearn.metrics import classification_report, f1_score, accuracy_score, confusion_matrix, precision_score, recall_score
from sklearn.model_selection import train_test_split, cross_val_score

# CONSTRAINTS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
# dict = {'z_id' : 'label_id'}
def critical_metrics_key(origTrainDict,predTrainDict):
    score = random.random()
    dataid = [3]

    return score


def cand_metrics_key(origTrainDict, predTrainDict):
    score = random.random()
    dataid = [15]
    label = 0
    weight = 5

    return score


def similar_diff_metrics_key(origTrainDict, predTrainDict):
    score = random.random()
    dataid = [(12,18), (10,19)]
    return score


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