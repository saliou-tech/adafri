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

"""This example adds demographic criteria to an ad group.

To get a list of ad groups, run get_ad_groups.py.

The LoadFromStorage method is pulling credentials and properties from a
"googleads.yaml" file. By default, it looks for this file in your home
directory. For more information, see the "Caching authentication information"
section of our README.

"""

from googleads import adwords



GENDER_MALE = '10'
GENDER_FEMALE = '11'
UNDETERMINED_GENDER = '20'
AGE_RANGE_UNDETERMINED = '503999'

AD_GROUP_ID = '72362966135'

#Function for only target male ==> disable female et undetermined
def SetPlacement(client, ad_group_id, placement, last_placement):
  result = []
  print("initial placement")
  print(placement)
  ad_group_criteria = []
  ad_group_criterion_service = client.GetService(
        'AdGroupCriterionService', version='v201809')
 
  
  if len(last_placement) > 0:
    print('last placement not null')
    print(last_placement)
    print("removing last placement")
    for place in last_placement:
      #if len(place) !=0:
          ad_group_criteria.append(
              # Exclusion criterion.
              {
                  'xsi_type': 'BiddableAdGroupCriterion',
                  'adGroupId': ad_group_id,
                  'criterion': {
                      'xsi_type': 'Placement',
                      # Create age range criteria. The IDs can be found in the
                      # documentation:
                      # https://developers.google.com/adwords/api/docs/appendix/ages.
                      'id':  place['criterion_id']
                  }
              })
              
    operations = []
    for criterion in ad_group_criteria:
      operations.append({
          'operator': 'REMOVE',
          'operand': criterion
      })
    print('last placement removed')
    remove = ad_group_criterion_service.mutate(operations)
    print(remove)
    if 'value' in remove:  
      print("addind placement")
      print("actual placement")
      print(placement)
      for place in placement:
        i=0
        ad_group_criteria = []
        if len(place) !=0:
          while i<len(place):
            
        
            ad_group_criteria.append(
                  # Exclusion criterion.
                  {
                      'xsi_type': 'BiddableAdGroupCriterion',
                      'adGroupId': ad_group_id,
                      'criterion': {
                          'xsi_type': 'Placement',
                          # Create age range criteria. The IDs can be found in the
                          # documentation:
                          # https://developers.google.com/adwords/api/docs/appendix/ages.
                          'url': place[i]['item_id']
                      }
                  })


    # Create operations.
            operations = []
            for criterion in ad_group_criteria:
              operations.append({
                  'operator': 'ADD',
                  'operand': criterion
              })

            response = ad_group_criterion_service.mutate(operations)

            if response and response['value']:
              criteria = response['value']
              for ad_group_criterion in criteria:
                criterion = ad_group_criterion['criterion']
                print ('Ad group criterion with ad group ID %s, criterion ID %s and '
                      'type "%s" was added.' %
                      (ad_group_criterion['adGroupId'], criterion['id'],
                        criterion['type']))
                result.append({
                    "item_id": place[i]['item_id'],
                    "item_text": place[i]['item_text'],
                    "criterion_id": criterion['id'],
                    "citerion_type": criterion['type']
                })
              criteria = []
              criterion = []
              ad_group_criteria = []
            else:
              print('No criteria were returned.')
            i = i+1
  else:
    print('condition')
    for place in placement:
      ad_group_criteria = []
      i=0
      if len(place) !=0:
          while i<len(place):
            
            ad_group_criteria.append(
                # Exclusion criterion.
                {
                    'xsi_type': 'BiddableAdGroupCriterion',
                    'adGroupId': ad_group_id,
                    'criterion': {
                        'xsi_type': 'Placement',
                        # Create age range criteria. The IDs can be found in the
                        # documentation:
                        # https://developers.google.com/adwords/api/docs/appendix/ages.
                        'url': place[i]['item_id']
                    }
                })
        

  # Create operations.
            operations = []
            for criterion in ad_group_criteria:
              operations.append({
                  'operator': 'ADD',
                  'operand': criterion
              })

            response = ad_group_criterion_service.mutate(operations)

            if response and response['value']:
              criteria = response['value']
              for ad_group_criterion in criteria:
                criterion = ad_group_criterion['criterion']
                print ('Ad group criterion with ad group ID %s, criterion ID %s and '
                      'type "%s" was added.' %
                      (ad_group_criterion['adGroupId'], criterion['id'],
                        criterion['type']))
                result.append({
                    "item_id": place[i]['item_id'],
                    "item_text": place[i]['item_text'],
                    "criterion_id": criterion['id'],
                    "citerion_type": criterion['type']
                })
              criteria = []
              criterion = []
              ad_group_criteria = []
            else:
              print('No criteria were returned.')
            i = i+1

    
  return result


