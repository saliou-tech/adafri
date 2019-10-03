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

""" AGE_18_24 = "503001"
AGE_25_34 = "503002"
AGE_35_44 = "503003"
AGE_45_54 = "503004"
AGE_55_64 = "503005"
AGE_64___ = "503006" 
AGE_RANGE_UNDETERMINED = '503999'
"""
AD_GROUP_ID = '72362966135'


def TargetAge(client, ad_group_id, ages):
  result = []
  i = 0
  print(ages)
  AGES = ['503001', '503002', '503003', '503004', '503005', '503006', '503999']
  ad_group_criteria = []
  ad_group_criterion_service = client.GetService(
        'AdGroupCriterionService', version='v201809')
  if len(ages) != len(AGES):
    for age in ages:
        if str(age) in AGES:
          AGES.remove(str(age)) 
    print('age')
    print(ages)
    # Initialize appropriate service.
    # Create the ad group criteria.
    ad_group_criteria = [
        # Exclusion criterion.
        {
            'xsi_type': 'NegativeAdGroupCriterion',
            'adGroupId': ad_group_id,
            'criterion': {
                'xsi_type': 'AgeRange',
                # Create age range criteria. The IDs can be found in the
                # documentation:
                # https://developers.google.com/adwords/api/docs/appendix/ages.
                'id': int(age)
            }
        }
    for age in AGES]
  else:
     ad_group_criteria = [
        # Exclusion criterion.
        {
            'xsi_type': 'BiddableAdGroupCriterion',
            'adGroupId': ad_group_id,
            'criterion': {
                'xsi_type': 'AgeRange',
                # Create age range criteria. The IDs can be found in the
                # documentation:
                # https://developers.google.com/adwords/api/docs/appendix/ages.
                'id': age
            }
        }
    for age in AGES]


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
          "criterion_id": criterion['id'],
          "citerion_type": criterion['type']
      })
  else:
    print('No criteria were returned.')
    
  return result
""" TargetAges(adwords.AdWordsClient.LoadFromStorage('../../googleads.yaml'), AD_GROUP_ID) """

""" if __name__ == '__main__':
  # Initialize client object.
  adwords_client = adwords.AdWordsClient.LoadFromStorage('../../googleads.yaml')

  main(adwords_client, AD_GROUP_ID)
 """