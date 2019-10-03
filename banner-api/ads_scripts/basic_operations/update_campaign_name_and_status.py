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

"""This example updates a campaign by setting its status to PAUSED.

To get campaigns, run get_campaigns.py.

The LoadFromStorage method is pulling credentials and properties from a
"googleads.yaml" file. By default, it looks for this file in your home
directory. For more information, see the "Caching authentication information"
section of our README.

"""

from googleads import adwords
from .get_campaigns_using_id import get_campaign_with_id




def UpdateCampaignNameAndStatus(client, campaign_id, new_name, status):
  # Initialize appropriate service.
  campaign_service = client.GetService('CampaignService', version='v201809')
  campagne = []
  operations = [{
     'operator': 'SET',
          'operand': {
              'id': campaign_id,
              'name': new_name,
              "status": status,
          }
  }]
  campaigns = campaign_service.mutate(operations)
  for campaign in campaigns['value']:
    print ('Campaign with name "%s" and id "%s" was updated.' % (campaign['name'], campaign['id']))
    campagne.append({
      "id": campaign['id'],
      "name": campaign['name'],
      "status": campaign['status']
    })
    

  return campagne



#'startDate': (datetime.datetime.now() + datetime.timedelta(1)).strftime#('%Y%m%d'),
          #'endDate': (datetime.datetime.now() +
           #           datetime.timedelta(3)).strftime('%Y%m%d'),