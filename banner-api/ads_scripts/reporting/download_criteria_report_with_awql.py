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

import sys, os
from googleads import adwords
import csv
import json
from flask import jsonify, Flask



def get_campaign_report_performance(client, CampaignId):
  # Initialize appropriate service.
  report_downloader = client.GetReportDownloader(version='v201809')

  # Create report query.
  report_query = (adwords.ReportQueryBuilder()
                  .Select('Clicks', 'Impressions',
                          'Cost')
                  .From('CAMPAIGN_PERFORMANCE_REPORT')
                
                  .Where('CampaignId').In(CampaignId)
                  .During('LAST_7_DAYS')
                  .Build())

  # You can provide a file object to write the output to. For this
  # demonstration we use sys.stdout to write the report to the screen.
  dirname = os.path.dirname(__file__)
  print(dirname)

  filename = CampaignId + ".csv"
  path = os.path.join(dirname, "../../uploads/"+filename)

  #dirname = os.path.dirname(filename) 
  #print(os.path.exists(dirname))
  #if not os.path.exists(dirname):
  #  print('creating')
  #  os.makedirs(dirname)
  report_downloader.DownloadReportWithAwql(
      report_query, 'CSV',open(path, "w"), skip_report_header=True,
      skip_column_header=False, skip_report_summary=False,
      include_zero_impressions=True)

  result= []
  
  input_file = csv.DictReader(open(path))
  for row in input_file:
    result.append(row)
  print(result)

  print(result[0]['Cost'])
  report = {
    "clicks": result[0]['Clicks'],
    "cost": result[0]['Cost'],
    "impressions": result[0]['Impressions']
  }
  print(report)
  return report
 


def get_adgroup_report_performance(client, CampaignId):
  # Initialize appropriate service.
  report_downloader = client.GetReportDownloader(version='v201809')

  # Create report query.
  report_query = (adwords.ReportQueryBuilder()
                  .Select('Clicks', 'Impressions',
                          'Cost')
                  .From('CAMPAIGN_PERFORMANCE_REPORT')
                
                  .Where('CampaignId').In(CampaignId)
                  .During('LAST_7_DAYS')
                  .Build())

  # You can provide a file object to write the output to. For this
  # demonstration we use sys.stdout to write the report to the screen.
 
  report_downloader.DownloadReportWithAwql(
      report_query, 'CSV',open("../user__reporting/campaign_report/"+CampaignId+".csv", "w"), skip_report_header=True,
      skip_column_header=False, skip_report_summary=False,
      include_zero_impressions=True)

  result= []
  
  input_file = csv.DictReader(open("../user__reporting/campaign_report/"+CampaignId + ".csv"))
  for row in input_file:
    result.append(row)


  report = {
    "clicks": result[0]['Clicks'],
    "cost": result[0]['Cost'],
    "impressions": result[0]['Impressions']
  }
  return report


""" if __name__ == '__main__':
  # Initialize client object.
  adwords_client = adwords.AdWordsClient.LoadFromStorage('../../googleads.yaml')

  get_campaign_report_performance(adwords_client, "6445993347") """
