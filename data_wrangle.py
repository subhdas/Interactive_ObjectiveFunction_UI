
import pandas as pd
import numpy as np
import csv
import os
import time
from nltk.corpus import stopwords
import re

# writes panda dataframe as a csv file
def write_data(data_frame, path):
    data_frame.to_csv(path, sep=',', index=False)

# reads data from input csv file
def read_data_index(file_name):
    data_frame = pd.read_csv(file_name, na_values=['nan'])
    ind_list = [i for i in range(data_frame.shape[0])]
    data_frame.set_index([ind_list])
    # data_frame = set_df_index(data_frame,'ID')
    return data_frame

    # reads data from input csv file
def read_data(file_name):
    data_frame = pd.read_csv(file_name, na_values=['nan'])
    data_frame = data_frame.fillna(0)

    # data_frame = set_df_index(data_frame,'ID')
    return data_frame



# MIAN FUNC CALL
if __name__ == '__main__':
    start_time = time.time()
    # file_name = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src//dataCgis//data_withheadersClean_1.csv'))
    # file_name = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src//dataHist//histdata_i85_01Mar_15Jun_ref.csv'))
    # file_name = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src//histTest//histdata_i85_01Mar_15Jun_RP_4.csv'))
    file_name = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '01 Interactive_ObjectiveFunction_UI/static//data//def_credit_card.csv'))
    file_name = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '01 Interactive_ObjectiveFunction_UI/static//data//Employee_Compensation_SF_SUB.csv'))
    file_name = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '01 Interactive_ObjectiveFunction_UI/static//data//movie_metadata_short.csv'))
    file_name = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '01 Interactive_ObjectiveFunction_UI/static//data//diabetic_data.csv'))
    final_df = read_data(file_name)


    final_df = final_df.sample(n=500, random_state=1)

    # path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src//dataCgis//out//selectedTweets.csv'))
    # path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src//dataHist//histdata_i85_01Mar_15Jun_ref_selected_all.csv'))
    # path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '01 Interactive_ObjectiveFunction_UI/static//data//movie_metadata_short_SUB.csv'))
    path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '01 Interactive_ObjectiveFunction_UI/static//data//diabetic_data_short_SUB.csv'))
    write_data(final_df,path)

    print " done .... "
    print("--- %s seconds ---" % (time.time() - start_time))


