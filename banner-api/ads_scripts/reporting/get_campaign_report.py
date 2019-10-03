#!/usr/bin/env python
#
# Copyright 2016 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""This example downloads a criteria performance report with AWQL.

To get report fields, run get_report_fields.py.

The LoadFromStorage method is pulling credentials and properties from a
"googleads.yaml" file. By default, it looks for this file in your home
directory. For more information, see the "Caching authentication information"
section of our README.

"""

import sys
from googleads import adwords
import csv
import json
from io import StringIO
import pandas as pd


def main(client):
  # Initialize appropriate service.
  report_downloader = client.GetReportDownloader(version='v201809')

  # Create report query.
  report_query = (adwords.ReportQueryBuilder()
                  .Select('Amount','AverageCpm',
                          'Cost', 'Clicks', 'Impressions', 'AverageCost',
                          'InteractionTypes', 'ServingStatus', 'TotalAmount')
                  .From('CAMPAIGN_PERFORMANCE_REPORT')
              
                  .Where('CampaignId').In('6445993347')
                  .During('LAST_7_DAYS')
                  .Build())

  # You can provide a file object to write the output to. For this
  # demonstration we use sys.stdout to write the report to the screen.
  report = report_downloader.DownloadReportAsStreamWithAwql(
      report_query, 'CSV' , skip_report_header=False,
      skip_column_header=False, skip_report_summary=False,
      include_zero_impressions=True)

  """  response = report.read().decode('utf-8')
  s = response.splitlines(0)
  x = csv.reader(s)
  print(list(x)) """
  tab = []
  result=report.read().decode('utf-8')
  s = result.splitlines(0)
  x = csv.reader(s)
  data = pd.read_csv(report.read())

  print(data.head())
  
  """  reader = csv.DictReader(report, fieldnames = ( "Budget","Avg. CPM","Cost","Clicks", "Impressions,Avg. Cost", "Interaction Types", "Campaign serving status", "Total Budget amount" ))
  out = json.dumps( [ row for row in reader ] )    """ 



if __name__ == '__main__':
  # Initialize client object.
  adwords_client = adwords.AdWordsClient.LoadFromStorage('../../googleads.yaml')

  main(adwords_client)
