import os, sys
# Add parent directory to path so core and app can be imported
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import CampusOrbitHTTPHandler

# Vercel serverless Python handler entrypoint
class handler(CampusOrbitHTTPHandler):
    pass
