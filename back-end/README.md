# Smart Doctor Appointment (SDA) Backend

## Third Sprint
```
url: ticket/get-patients/
method: GET

response sample:
[
    ...
    {
        "id": 1005,
        "first_name": "Amir",
        "last_name": "Shamsi"
    }
    ...
]

-----------------------------------------------
url: disease/get-doctors/
method: POST

request sample: 
{
    "disease": "common cold"
}

response sample:
[   
    ...
    {
        "id": 1214,
        "first_name": "Amir",
        "last_name": "Askari"
    }
    ...
]

-----------------------------------

url: disease/set-appointment/
method: POST

request sample: 
{
    "disease": "common cold",
    "doctor_id" = 1214,
    "detail" = "This is a sample text.",
    "date" = "2023-01-26"
}

response sample:
{
    'Appointment set successfully!'
}

```


## Second Sprit
### API details
  1. Getting ***intro. questions*** that patients must answer before all.
  
  ```python3
  url: disease/question-intro/
  method: GET
  
  # Response
  [
    {
        "id": 1,
        "question": "Are you Overweight or Obese?"
    },
    {
        "id": 2,
        "question": "Do you smoke Cigarettes?"
    },
    {
        "id": 3,
        "question": "Do you have high Cholesterol?"
    },
    {
        "id": 4,
        "question": "Do you have Hypertension?"
    },
    {
        "id": 5,
        "question": "Do you have Diabetes?"
    }
]
  ```
  2. Getting ***symptoms*** for showing to the patient.
  ```python3
  url: disease/symptoms/
  method: GET
    
  # Response
  [
    "itching",
    "skin rash",
    "nodal skin eruptions",
    "continuous sneezing",
    "shivering",
    "chills",
    "joint pain",
    "stomach pain",
    "acidity",
    ...
   ]
  ```
  3. Posting patient ***intro. questions answer***, ***symptoms***, and patient ***symptoms detail*** if any then the `API` will return the **predicted disease** and also some helpful **precautions** for the patient and a **disease description** which will let the patient know more about his/her disease.
  ```python3
  url: disease/analysis/
  method: POST
  
  # Request Sample
  {
    "symptoms": [
                  "chest pain",
                  "breathlessness",
                  "cough"
    ],
    "detail": "I feel the chest pain is so much sometimes.",
    "intro_answer": [1, 0, 0, 1, 0]
  }
  
  # Response Sample
  {
    "disease": "Pneumonia",
    "precaution": [
        "consult doctor",
        "medication",
        "rest",
        "follow up"
    ],
    "description": """Pneumonia is an inflammatory condition of the lung primarily affecting
                      the small air sacs known as alveoli. Symptoms typically include some
                      combination of productive or dry cough, chest pain, fever, and difficulty
                      breathing. The severity of the condition is variable.Pneumonia is usually
                      caused by infection with viruses or bacteria, and less commonly by other
                      microorganisms. Identifying the responsible pathogen can be difficult. 
                      Diagnosis is often based on symptoms and physical examination..."""
  }
  ```
  4. Posting ***Doctor Credetials*** so doctors can register
  ```
  python3
  url: auth/users
  method: POST
  
  # Request Sample
  {
    "personal_ID": "2420704770",
    "first_name": "Arman",
    "last_name": "Keshavarzi",
    "email": "keshavarzi.m380@gmail.com",
    "city": 1,
    "contact_number": "09164067931",
    "gender": false,
    "birth_date": "1998-11-26",
    "has_health_insurance": false,
    "zip_code": "hellow",
    "health_insurance_company": null,
    "is_doctor": true,
    "doctor_code": "testtt"
  }

  # Response Sample
  {
    "id": 2,
    "personal_ID": "2420704770",
    "first_name": "Arman",
    "last_name": "Keshavarzi",
    "email": "keshavarzi.m380@gmail.com",
    "city": 1,
    "contact_number": "09164067931",
    "gender": false,
    "birth_date": "1998-11-26",
    "has_health_insurance": false,
    "zip_code": "hellow",
    "health_insurance_company": null,
    "is_doctor": true,
    "doctor_code": "testtt"
  }
  ```
