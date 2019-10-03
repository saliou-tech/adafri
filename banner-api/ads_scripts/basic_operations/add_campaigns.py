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

"""This example adds campaigns.

To get campaigns, run get_campaigns.py.

The LoadFromStorage method is pulling credentials and properties from a
"googleads.yaml" file. By default, it looks for this file in your home
directory. For more information, see the "Caching authentication information"
section of our README.

"""


import datetime
import uuid
from googleads import adwords


def CreateSharedBudget(client, name):
  """Creates an explicit budget to be used only to create the Campaign.

  Args:
    client: AdWordsClient the client to run the example with.

  Returns:
    dict An object representing a shared budget.
  """
  # Initialize appropriate service.
  budget_service = client.GetService('BudgetService', version='v201809')

  # Create a shared budget
  budget = {
      'name': name,
      'amount': {
          'microAmount': '1000000'
      },
      'deliveryMethod': 'STANDARD',
      'isExplicitlyShared': 'false'
  }
    
  

  # Create operation.
  operation = {
      'operator': 'ADD',
      'operand': budget
  }

  response = budget_service.mutate([operation])
  return response['value'][0]


def add_campaign(client, name):
  INFOS = []
  # Initialize appropriate services.
  campaign_service = client.GetService('CampaignService', version='v201809')
  budget_service = client.GetService('BudgetService', version='v201809')

  # Create a budget, which can be shared by multiple campaigns.
  budget = CreateSharedBudget(client, name)
  budget_id = budget['budgetId']

  # Construct operations and add campaigns.
  operations = [{
      'operator': 'ADD',
      'operand': {
          'name': name,
          # Recommendation: Set the campaign to PAUSED when creating it to
          # stop the ads from immediately serving. Set to ENABLED once you've
          # added targeting and the ads are ready to serve.
          'status': 'PAUSED',
          'advertisingChannelType': 'DISPLAY',
           'biddingStrategyConfiguration': {
              'biddingStrategyType': 'MANUAL_CPM',
               
          },
          
          
          'startDate':  (datetime.datetime.now() +
                      datetime.timedelta(10)).strftime('%Y%m%d'),
          'endDate': (datetime.datetime.now() +
                      datetime.timedelta(20)).strftime('%Y%m%d'),
          # Note that only the budgetId is required
          'budget': {
              'budgetId': budget_id
          },
          
         
      }
  }]
  campaigns = campaign_service.mutate(operations)

  # Display results.
  try:
    for campaign in campaigns['value']:
        INFOS.append({
            "id": campaign['id'],
            "name": campaign['name'],
            "status": campaign['status'],
            "startDate": campaign['startDate'],
            "endDate": campaign['endDate'],
            "startDateFrench": campaign['startDate'][-2:] + "/" + campaign['startDate'][-4:-2] + "/" + campaign['startDate'][:4],
            "endDateFrench": campaign['endDate'][-2:] + "/" + campaign['endDate'][-4:-2] + "/" + campaign['endDate'][:4],
            "biddingStrategyConfiguration": campaign['biddingStrategyConfiguration'],
            "servingStatus": campaign['servingStatus'],
            "budgetId": budget_id,
            })
        print ('Campaign with name "%s" and id "%s" was added.'
            % (campaign['name'], campaign['id']))
  except:
      INFOS.append({
          "status": "error"
      })


  return INFOS
 # Optional fields
"""  'frequencyCap': {
              'impressions': '5',
              'timeUnit': 'DAY',
              'level': 'ADGROUP'
          },
          'settings': [
              {
                  'xsi_type': 'GeoTargetTypeSetting',
                  'positiveGeoTargetType': 'DONT_CARE',
                  'negativeGeoTargetType': 'DONT_CARE'
              }
          ] 
"""