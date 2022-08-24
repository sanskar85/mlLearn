import pandas as pd
import numpy as np
import seaborn as sns
from sklearn import svm, datasets
import matplotlib.pyplot as plt


class SVM:
    def __init__(self, csv):
        data = pd.read_csv(csv)
        self.dataset = pd.DataFrame(data)

    def getColumns(self):
        return self.dataset.columns


# dataset = null

# def loadDataset(csv):
#     data = pd.read_csv(csv)
#     dataset = pd.DataFrame(data)

def getColumns():
    return dataset.columns


# In[15]:


dataset.info()


# In[16]:


dataset.isnull().sum()


# Label Encoding

# In[17]:


from sklearn.preprocessing import LabelEncoder
enc = LabelEncoder()
dataset.loc[:,['Gender','family_history_with_overweight','FAVC','CAEC','SMOKE','SCC','CALC','MTRANS','NObeyesdad']] = \
dataset.loc[:,['Gender','family_history_with_overweight','FAVC','CAEC','SMOKE','SCC','CALC','MTRANS','NObeyesdad']].apply(enc.fit_transform)
dataset.head()


# SVM

# In[18]:


from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression  
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report,recall_score,precision_score,f1_score
  


# In[19]:


target = dataset["NObeyesdad"]
features = dataset.drop(["NObeyesdad"], axis=1)
X_train, X_test, y_train, y_test = train_test_split(features,target, test_size = 0.1, random_state = 0)


# In[20]:


svc_model = SVC(C= 2, kernel='rbf', gamma= 0.1)
svc_model.fit(X_train, y_train)
prediction = svc_model .predict(X_test)
# check the accuracy on the training set
print(svc_model.score(X_test, y_test))


# **Confusion Matrix**

# In[22]:


cm = confusion_matrix(y_test, prediction)
# Creating a dataframe for a array-formatted Confusion matrix,so it will be easy for plotting.
print(cm)
plt.figure(figsize=(5,4))
sns.heatmap(cm, annot=True)
plt.title('Confusion Matrix of Obesity by SVM')
plt.ylabel('Actal Values')
plt.xlabel('Predicted Values')
# plt.show()
plt.savefig('misc.png', dpi=600,  bbox_inches = 'tight')


# **Recall Score**

# In[11]:


rc_macro = recall_score(y_test, prediction, average='macro')
rc_micro = recall_score(y_test, prediction, average='micro')
rc_weighted = recall_score(y_test, prediction, average='weighted')

print(rc_macro)
print(rc_micro)
print(rc_weighted)

print((rc_macro+rc_micro+rc_weighted)/3)


# **Precision Score**

# In[12]:


pc_macro = precision_score(y_test, prediction, average='macro')
pc_micro = precision_score(y_test, prediction, average='micro')
pc_weighted = precision_score(y_test, prediction, average='weighted')

print(pc_macro)
print(pc_micro)
print(pc_weighted)

print((pc_macro+pc_micro+pc_weighted)/3)


# **F1 Score**

# In[12]:


f1_macro = f1_score(y_test, prediction, average='macro')
f1_micro = f1_score(y_test, prediction, average='micro')
f1_weighted = f1_score(y_test, prediction, average='weighted')

print(f1_macro)
print(f1_micro)
print(f1_weighted)

print((f1_macro+f1_micro+f1_weighted)/3)


# # Logistic Regression

# In[13]:


model_logistic = LogisticRegression(solver='newton-cg',max_iter=10000000)
model_logistic.fit(X_train , y_train)
y_pred_logistic = model_logistic.predict(X_test)


# **Accuracy**

# In[14]:


#print(model_logistic.score(X_train , y_train))
print(model_logistic.score(X_test , y_test))


# **Recall Score**

# In[15]:


rc_macro = recall_score(y_test, y_pred_logistic, average='macro')
rc_micro = recall_score(y_test, y_pred_logistic, average='micro')
rc_weighted = recall_score(y_test, y_pred_logistic, average='weighted')

print(rc_macro)
print(rc_micro)
print(rc_weighted)

print((rc_macro+rc_micro+rc_weighted)/3)


# **Precision Score**

# In[16]:


pc_macro = precision_score(y_test, y_pred_logistic, average='macro')
pc_micro = precision_score(y_test, y_pred_logistic, average='micro')
pc_weighted = precision_score(y_test, y_pred_logistic, average='weighted')

print(pc_macro)
print(pc_micro)
print(pc_weighted)

print((pc_macro+pc_micro+pc_weighted)/3)


# **F1 Score**

# In[17]:


f1_macro = f1_score(y_test, y_pred_logistic, average='macro')
f1_micro = f1_score(y_test, y_pred_logistic, average='micro')
f1_weighted = f1_score(y_test, y_pred_logistic, average='weighted')

print(f1_macro)
print(f1_micro)
print(f1_weighted)

print((f1_macro+f1_micro+f1_weighted)/3)



# **Confusion Matrix**

# In[18]:


cm = confusion_matrix(y_test, y_pred_logistic)
# Creating a dataframe for a array-formatted Confusion matrix,so it will be easy for plotting.
print(cm)
plt.figure(figsize=(5,4))
sns.heatmap(cm, annot=True)
plt.title('Confusion Matrix')
plt.ylabel('Actal Values')
plt.xlabel('Predicted Values')
# plt.show()

plt.savefig('misc.png', dpi=600,  bbox_inches = 'tight')


# # Comparison Graph

# In[ ]:


barWidth = 0.2
fig = plt.subplots(figsize =(12, 8))
 
# set height of bar
LINEAR = [98.29,98.31,98.31,98.07]
POLY = [98.18,98.21,98.21,98.20]
RBF = [98.75,98.77,98.77,98.75]
LOGISTIC = [ 97.84,97.89,97.88,97.87]
 
# Set position of bar on X axis
br1 = np.arange(len(LINEAR))
br2 = [x + barWidth for x in br1]
br3 = [x + barWidth for x in br2]
br4 = [x + barWidth for x in br3]
 
# Make the plot
plt.bar(br1, LINEAR,  width = barWidth,edgecolor ='grey', label ='SVM Linear')
plt.bar(br2, POLY,  width = barWidth,edgecolor ='grey', label ='SVM Poly')
plt.bar(br3, RBF,  width = barWidth,edgecolor ='grey', label ='SVM RBF')
plt.bar(br4, LOGISTIC, width = barWidth,edgecolor ='grey', label ='Logistic Regression')
 
# Adding Xticks
plt.xlabel('Performace Factors', fontweight ='bold', fontsize = 15)
plt.ylabel('Performance Values', fontweight ='bold', fontsize = 15)
plt.xticks([r + barWidth for r in range(len(LINEAR))],['Accuracy', 'Recall Score','Precision Score','F1 Score'])

plt.ylim([96, 100])
plt.legend()
# plt.show()

plt.savefig('misc.png', dpi=600,  bbox_inches = 'tight')


# In[ ]:




