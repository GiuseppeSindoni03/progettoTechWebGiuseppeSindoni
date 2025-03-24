# Full-Stack Web Application: Angular + Express + MongoDB + AWS S3

Questo repository contiene un'applicazione web full-stack con:

- **Frontend** in Angular
- **Backend** in Node.js con Express
- **Database** MongoDB (su Atlas)
- **Storage** su AWS S3 per le immagini profilo utente

---


## Requisiti

Assicurati di avere installato:

- Node.js (>= 18)
- npm
- Angular CLI (`npm install -g @angular/cli`)
- Un account MongoDB Atlas
- Un account AWS con un bucket S3 e un utente IAM configurato

---

## Setup
### 1. Clona il progetto
git clone <repo-url>
cd <repo-folder>

### 2. Installa le dipendenze
- **Backend**
    cd backend
    npm install
- **Frontend**
    cd ../frontend
    npm install

### 3. Crea un Cluster MongoDB
Puoi utilizzare *MongoDB Atlas* per creare gratuitamente un cluster MongoDB. 
Assicurati di:
- abilitare l'accesso IP pubblico (cosa che ti sconsiglio di fare) o whitelist
- crea un utente con accesso in lettura/scrittura

### 4. Configura AmazonS3
- Vai su aws S3 console e crea bucket, il cui nome e regione dovranno rispettivamente corrispondere a       **AWS_BUCKET_NAME** e **AWS_REGION** nel *.env*
- Vai su IAM Console e crea un nuovo utente con permessi **PutObject** e **GetObject** in modo da permettere sia di inserire foto che richiederle.

### 5. Configura le variabili d'ambiente
All'interno del backend avrai un file .env con la seguente struttura:
MONGO_URI="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority"
PORT=3000
JWT_SECRET="una-stringa-segreta"
AWS_ACCESS_KEY_ID="la-tua-access-key"
AWS_SECRET_ACCESS_KEY="la-tua-secret-key"
AWS_BUCKET_NAME="nome-del-bucket"
AWS_REGION="regione"

**Mi raccomando non condividere queste informazioni con nessuno**

### 6. Avviare il progetto
- **Backend** (il server sara' disponibile sulla porta 3000)
    cd backend
    npm start
- **Frontend** (l'app sara' disponibile sulla porta 4200)
    cd frontend
    ng serve

