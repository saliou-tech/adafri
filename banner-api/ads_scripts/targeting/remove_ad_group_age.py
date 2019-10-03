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

"""This example deletes an ad group criterion using the 'REMOVE' operator.

To get ad group criteria, run get_keywords.py.

The LoadFromStorage method is pulling credentials and properties from a
"googleads.yaml" file. By default, it looks for this file in your home
directory. For more information, see the "Caching authentication information"
section of our README.

"""

from googleads import adwords



def RemoveTargetAge(client, ad_group_id, criterions_id):
  print('last_age')
  print(criterions_id)

  # Initialize appropriate service.
  AGES = ['503001', '503002', '503003', '503004', '503005', '503006', '503999']
  ad_group_criterion_service = client.GetService(
      'AdGroupCriterionService', version='v201809')
  if len(criterions_id) < 7:
    print('last_age len inferieur')
    for age in criterions_id:
      if str(age) in AGES:
       AGES.remove(str(age))
    print('AGES')
    print(AGES)
     
  """ else:
     AGES =AGES    
     print('last_age len = 7')
     print('AGES')
     print(AGES) """
  
 
 

  # Construct operations and delete ad group criteria.
  operations = [
      {
          'operator': 'REMOVE',
          'operand': {
              'xsi_type': 'NegativeAdGroupCriterion',
              'adGroupId': ad_group_id,
              'criterion': {
                  'id': int(age)
              }
          }
      }
  for age in AGES]
  result = ad_group_criterion_service.mutate(operations)

  # Display results.
  response = []
  for criterion in result['value']:
    response.append({
        "service": ad_group_criterion_service
    })
    print ('Ad group criterion with ad group id "%s", criterion id "%s", '
           'and type "%s" was deleted.'
           % (criterion['adGroupId'], criterion['criterion']['id'],
              criterion['criterion']['Criterion.Type']))
    return response 


