env='production'

cd backend/datamanagement
NODE_ENV=$env node db_importfromexcel

NODE_ENV=$env node pre_computing

echo "pre computing successfully realized"
