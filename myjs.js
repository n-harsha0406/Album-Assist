const express = require("express");
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors()); // Allows incoming requests from any IP


const folderPath = path.join(__dirname, 'unknown images');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Error reading folder:', err);
    res.status(500).json({ error: 'Error reading folder' });
    return;
  }

  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    fs.unlinkSync(filePath); // Delete each file in the folder
  });

  
});


const folderPath2 = path.join(__dirname, 'comparing image');

fs.readdir(folderPath2, (err, files) => {
  if (err) {
    console.error('Error reading folder:', err);
    res.status(500).json({ error: 'Error reading folder' });
    return;
  }

  files.forEach(file => {
    const filePath = path.join(folderPath2, file);
    fs.unlinkSync(filePath); // Delete each file in the folder
  });

  
});


const folderPath3 = path.join(__dirname, 'known image');

fs.readdir(folderPath3, (err, files) => {
  if (err) {
    console.error('Error reading folder:', err);
    res.status(500).json({ error: 'Error reading folder' });
    return;
  }

  files.forEach(file => {
    const filePath = path.join(folderPath3, file);
    fs.unlinkSync(filePath); // Delete each file in the folder
  });

  
});
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, 'unknown images'));
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const storage2 = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, 'comparing image'));
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage: storage });
const upload2 = multer({ storage: storage2 });

app.post("/api", upload.array("files"), (req, res) => {
    console.log(req.body);
    console.log(req.files);
    res.json({ message: "File(s) uploaded successfully" });
});

app.post("/ref", upload2.single("file"), (req, res) => {
    console.log(req.body);
    console.log(req.file);
    res.json({ message: "File(s) uploaded successfully" });
});
//-------------------------------------------------------------------------------------------------------------------
app.get("/getImages", (req, res) => {
    const folderPath = 'known image';

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading folder:', err);
            res.status(500).json({ error: 'Error reading folder' });
            return;
        }

        const imageFiles = files.filter(file => {
            const extname = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif'].includes(extname);
        });

        const imageUrls = imageFiles.map(file => {
            return `http://localhost:5000/known_image/${file}`;
        });

        res.json(imageUrls);
    });
});

app.use('/known_image', express.static('known image'));
app.use('/comparing image', express.static('comparing image'));

app.listen(5000, function(){
    console.log("Server running on port 5000");
});

const existingHTMLFile = 'templates\\imageDisplay.html';

fs.readdir('known image', (err, files) => {
    if (err) {
        console.error('Error reading folder:', err);
        return;
    }

    const imageFiles = files.filter(file => {
        const extname = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif'].includes(extname);
    });

    const imagesMarkup = imageFiles.map(file => {
        const imagePath = path.join('known image', file);
        return `<img src="${imagePath}" alt="${file}" />`;
    }).join('');

    fs.readFile(existingHTMLFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading existing HTML file:', err);
            return;
        }

        const placeholder = '<!-- INSERT_IMAGES_HERE -->';

        const updatedHTML = data.replace(placeholder, imagesMarkup);

        fs.writeFile(existingHTMLFile, updatedHTML, 'utf8', err => {
            if (err) {
                console.error('Error updating HTML file:', err);
                return;
            }
            console.log('HTML file updated successfully.');
        });
    });
});
