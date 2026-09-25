# Vehicle Fraud ML Project — Step 1

## What is already completed

The original notebook contains the ML experimentation:
- data cleaning
- EDA
- encoding
- scaling
- train/test split
- model comparison
- cross-validation
- hyperparameter tuning

## What changed in Step 1

A new **Task 6: Deployment-Ready ML Pipeline** was added at the end of the notebook.

The original Task 5 cells were not deleted.

The new section:
1. Reloads the raw CSV.
2. Removes missing target rows.
3. Applies the previously defined `drop_cols`.
4. Explicitly maps `N = 0` and `Y = 1`.
5. Separates X and y.
6. Detects numeric and categorical columns.
7. Uses `StandardScaler` for numeric data.
8. Uses `OneHotEncoder(handle_unknown="ignore")` for categorical data.
9. Splits the data before fitting preprocessing.
10. Combines preprocessing + Decision Tree in one scikit-learn Pipeline.
11. Evaluates the new deployment pipeline.
12. Saves `vehicle_fraud_pipeline.pkl`.

## Important

The CSV file `insurance_fraud_data.csv` is required to run the new Task 6 cells.

The `.pkl` file is intentionally not included because the dataset is not present in the uploaded project environment, so the pipeline must be trained by you after opening the notebook.

## Project direction

After this step is successfully run, the next step will be testing the saved `.pkl` independently. Only after that will we create the Python FastAPI service.
