# rembg_model.py
from rembg import new_session

#  Load model once and reuse
session = new_session(model_name="u2net", providers=["CUDAExecutionProvider", "CPUExecutionProvider"])
