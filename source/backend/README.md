# WQPMS Backend

This folder contains the Django-based backend server for the WQPMS system.

## Installing and Running for Development

Steps to install and run the backend is as follows:
- Install [Python 3.8+](https://www.python.org/downloads/)
- Create a virtual environment and activate it. See detailed instructions [here](https://rasulkireev.com/django-venv/) [(archive link)](https://archive.is/V6ZG3). (This is optional if never installed Python libraries before)
- Install libraries needed, listed in `requirements.txt`, by executing `pip install -r requirements.txt`
- To run the server: `py manage.py runserver`

Please note that the water quality data provided by the Ministry is also needed, and we're not able to distribute the data without their permission.
