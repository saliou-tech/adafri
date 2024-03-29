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

"""This example gets all disapproved ads for a given campaign.

To add an ad, run add_ads.py.

The LoadFromStorage method is pulling credentials and properties from a
"googleads.yaml" file. By default, it looks for this file in your home
directory. For more information, see the "Caching authentication information"
section of our README.

"""

from googleads import adwords
from googletrans import Translator

AD_GROUP_ID = '77087191346'
PAGE_SIZE = 100


def getPolicySummurry(client, ad_group_id):
  # Initialize appropriate service.
  translator = Translator()
  ad_group_ad_service = client.GetService('AdGroupAdService', version='v201809')

  # Construct selector and get all ads for a given ad group.
  offset = 0
  selector = {
      'fields': ['Id', 'PolicySummary', 'CombinedApprovalStatus'],
      'predicates': [
          {
              'field': 'AdGroupId',
              'operator': 'EQUALS',
              'values': [ad_group_id]
          },
        
      ],
      'paging': {
          'startIndex': str(offset),
          'numberResults': str(PAGE_SIZE)
      }
  }

  more_pages = True
  disapproved_count = 0

  # Display results.
  result = []
  policy = []
 
  while more_pages:
    page = ad_group_ad_service.get(selector)

    if 'entries' in page:
      for ad in page['entries']:
        disapproved_count += 1
        policy_summary = ad['policySummary']
        print(ad['policySummary'])
        """  print ('Ad with id "%s" and  disapproved with the following policy '
               'topic entries:' % ad['ad']['id']) """
        # Display the policy topic entries related to the ad disapproval.
        for policy_topic_entry in policy_summary['policyTopicEntries']:
          if len(policy_topic_entry['policyTopicEntryType']) > 0:
            policy.append({
              "policyTopicEntryType": translator.translate(policy_topic_entry['policyTopicEntryType'], dest="fr").text,
              "policyTopicId": policy_topic_entry['policyTopicId'],
              "policyTopicName": translator.translate(policy_topic_entry['policyTopicName'], dest="fr").text,
              "policyTopicEvidences": policy_topic_entry['policyTopicEvidences'],
              "policyTopicHelpCenterUrl": policy_topic_entry['policyTopicHelpCenterUrl']
            })
          else:
            policy.append([])
        




        """  print ('  topic ID: %s, topic name: %s, Help Center URL: %s' % (
              policy_topic_entry['policyTopicId'],
              policy_topic_entry['policyTopicName'],
              policy_topic_entry['policyTopicHelpCenterUrl'])) """
      
        """ policy_topic_evidences = policy_topic_entry['policyTopicEvidences']
          if policy_topic_evidences:
            
            for evidence in policy_topic_entry['policyTopicEvidences']:
              topic_evidences.append({
                "policyTopicEvidenceType": evidence['policyTopicEvidenceType']
              })
              print ('    evidence type: %s'
                     % evidence['policyTopicEvidenceType'])
              evidence_text_list = evidence['evidenceTextList']
              if evidence_text_list:
                for index, evidence_text in enumerate(evidence_text_list):
                  print ('      evidence text[%d]: %s' % (index, evidence_text)) """
        result.append({
           "ad_id":  ad['ad']['id'],
            "combinedApprovalStatus": translator.translate(policy_summary['combinedApprovalStatus'], dest="fr").text,
          "policy": policy
        })
        policy = []
    offset += PAGE_SIZE
    selector['paging']['startIndex'] = str(offset)
    more_pages = offset < int(page['totalNumEntries'])
  print(result)
  return result
  #print('%d disapproved ads were found.' % disapproved_count)
  


""" if __name__ == '__main__':
  # Initialize client object.
  adwords_client = adwords.AdWordsClient.LoadFromStorage("../../googleads.yaml")

  main(adwords_client, AD_GROUP_ID) """
