[![Build Status](https://snap-ci.com/voitau/local-alert-backend/branch/master/build_image)](https://snap-ci.com/voitau/local-alert-backend/branch/master)
# boss-backend

# Submission
## Create
curl -X POST URL/api/Submissions

# Binary data
## Upload
curl -X POST -F "image=FILE_NAME" URL/api/Containers/DIRECTORY/upload

## Download
curl -X GET URL/api/Containers/DIRECTORY/download/FILE_NAME

# Payments
## Generate BrainTree token
curl -X GET URL/api/ClientTokens/generate

## Make payment
TBD
