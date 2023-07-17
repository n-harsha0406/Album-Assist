from flask import Flask,render_template,url_for,request
import face_recognition;
import os;
import cv2;
import shutil;

app = Flask(__name__)

@app.route('/')
def home():
	return render_template('imageDisplay.html')

@app.route('/predict',methods=['POST'])
def predict():
    l = os.listdir("comparing image")
    name = l[0]
    compare_path="comparing image"
    known_image=cv2.imread(os.path.join(compare_path,name))
    known_image_encoding=face_recognition.face_encodings(known_image)
    known_images_path='known image'
    os.listdir("unknown images")
    matched_image_name=[]

    for pic in os.listdir("unknown images"):
        unknown_image=cv2.imread("unknown images/"+pic)
        flag=0
        flag1=0
        print("Starting to compare:",pic,name,end="==> ")
        for i in range(4):
            unknown_image_encodings=face_recognition.face_encodings(unknown_image)
            try:
                if(len(unknown_image_encodings)==0):
                    print("raised==> Roatating image for ",i+1,'times')
                    raise ValueError;
            except ValueError:
                unknown_image=cv2.rotate(unknown_image,cv2.ROTATE_90_COUNTERCLOCKWISE)
                
                continue
            flag1=1;
            p=0;
            for unknown_image_encoding in unknown_image_encodings:
                results=face_recognition.compare_faces(known_image_encoding,unknown_image_encoding)
                
                if(results[0]==True):
                    flag=1
                    matched_image_name.append(pic);
                    print(results[0],pic)
                    
                if(flag==1):
                    break;
            if(flag1==1 and flag==0):
                print("Not matched")
                
            break;
        # else:
        #     print("Not found")
    from_folder_path='unknown images'
    to_folder_path=known_images_path

    print("Copying folder in progress...",end="==>")
    for pic in matched_image_name:
        shutil.copy(os.path.join(from_folder_path,pic),os.path.join(to_folder_path,pic))
        print(" copied:",pic)
    print("All folder copying completed.")
    return render_template("imageDisplay.html")
if __name__ == '__main__':
	app.run(debug=True)