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

"""Adds an ad group level mobile bid modifier override for a campaign.

To get your ad groups, run get_ad_groups.py.

The LoadFromStorage method is pulling credentials and properties from a
"googleads.yaml" file. By default, it looks for this file in your home
directory. For more information, see the "Caching authentication information"
section of our README.

"""

from googleads import adwords

def TargetDevices(client, ad_group_id, criterions_id, last_criterion):
  # Initialize appropriate service.
  response = {}
  result = []
  PLATFORMS = ['30000', '30001', '30002', '30004']
  ad_group_bid_modifier_service = client.GetService(
      'AdGroupBidModifierService', version='v201809')

  # Mobile criterion ID.

  # Prepare to add an ad group level override.
  if len(criterions_id)<4:
    if len(last_criterion)==0:
  
        for crit in criterions_id:
            if str(crit) in PLATFORMS:
                PLATFORMS.remove(str(crit))
        operation = [{
      # Use 'ADD' to add a new modifier and 'SET' to update an existing one. A
      # modifier can be removed with the 'REMOVE' operator.
          'operator': 'ADD',
          'operand': {
          'adGroupId': ad_group_id,
          'criterion': {
              'xsi_type': 'Platform',
              'id': criterion_id
          },
          'bidModifier': 1.5
         }
       }
        for criterion_id in criterions_id]

  # Add ad group level mobile bid modifier.
        response = ad_group_bid_modifier_service.mutate([operation])
    else:
        operation = [{
    # Use 'ADD' to add a new modifier and 'SET' to update an existing one. A
      # modifier can be removed with the 'REMOVE' operator.
      'operator': 'REMOVE',
      'operand': {
          'adGroupId': ad_group_id,
          'criterion': {
              'xsi_type': 'Platform',
              'id': criterion_id
          },
          'bidModifier': 1.5
        }
      }
        for criterion_id in last_criterion]
        response = ad_group_bid_modifier_service.mutate([operation])
  else:
    print(len(last_criterion))
    if len(last_criterion)==0:
       operation = [{
    # Use 'ADD' to add a new modifier and 'SET' to update an existing one. A
      # modifier can be removed with the 'REMOVE' operator.
      'operator': 'ADD',
      'operand': {
          'adGroupId': ad_group_id,
          'criterion': {
              'xsi_type': 'Platform',
              'id': criterion_id
          },
          'bidModifier': 1.5
        }
      }
       for criterion_id in criterions_id]
       response = ad_group_bid_modifier_service.mutate([operation])
    else:
       operation = [{
    # Use 'ADD' to add a new modifier and 'SET' to update an existing one. A
      # modifier can be removed with the 'REMOVE' operator.
      'operator': 'REMOVE',
      'operand': {
          'adGroupId': ad_group_id,
          'criterion': {
              'xsi_type': 'Platform',
              'id': criterion_id
          },
          'bidModifier': 1.5
        }
      }
       for criterion_id in last_criterion]
       response = ad_group_bid_modifier_service.mutate([operation])


 
  if response and response['value']:
    modifier = response['value'][0]
    value = modifier['bidModifier'] if 'bidModifier' in modifier else 'unset'
    print ('Campaign ID %s, AdGroup ID %s, Criterion ID %s was updated with '
           'ad group level modifier: %s' %
           (modifier['campaignId'], modifier['adGroupId'],
            modifier['criterion']['id'], value))
    result.append({
          "status": "ok"
          
      })
  else:
    print('No modifiers were added.')
  return result



