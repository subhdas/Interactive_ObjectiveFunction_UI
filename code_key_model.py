def critical_metrics_key(targetTrain, predTrain, trainId):
        predTrainDict = {}
        origTrainDict = {}

        trainId = trainId.values
        targetTrain = targetTrain.values
        # print('train in key 1', trainId, len(trainId))
        # print('train in key 2', predTrain, len(predTrain))
        # print('train in key 3', targetTrain, len(targetTrain))

        ind = [12, 23, 5]
        critIds = [trainId[ind[0]], trainId[ind[1]], trainId[ind[2]]]
        for i in range(len(predTrain)):
            id = trainId[i]
            predTrainDict[str(id)] = str(predTrain[i])
            origTrainDict[str(id)] = str(targetTrain[i])
        # print('pred train dict ', predTrainDict)
        # print('orig train dict ', origTrainDict)
        critScore = 0
        for i in range(len(critIds)):
            if(predTrainDict[str(critIds[i])] == origTrainDict[str(critIds[i])]):
                critScore += 1

        if(len(critIds) == 0): return 0
        critScore = (critScore*1.0)/len(critIds)

        print ' getting crit score as ', critScore, critIds
        return critScore
