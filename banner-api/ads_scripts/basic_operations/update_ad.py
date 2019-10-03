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

"""This example updates status for a given ad.

To get ads, run get_text_ads.py.

The LoadFromStorage method is pulling credentials and properties from a
"googleads.yaml" file. By default, it looks for this file in your home
directory. For more information, see the "Caching authentication information"
section of our README.

"""


from flask import Flask, render_template, request, session, redirect, url_for,send_from_directory, jsonify
from urllib.request import build_opener, Request, urlopen
from requests_html import HTMLSession
import gzip
from googleads import adwords
import base64
from PIL import Image
from io import BytesIO
import sys
import os
import io
import tinify
import binascii
import datetime
import pngquant
import requests
import json
from json import JSONEncoder
from .remove_ad import RemoveAd

AD_GROUP_ID = 'INSERT_AD_GROUP_ID_HERE'
AD_ID = 'INSERT_AD_ID_HERE'

def UploadImageAsset(client, url, image_ref_on_file):
  """Uploads the image from the specified url.
  Args:
    client: An AdWordsClient instance.
    url: The image URL.
  Returns:
    The ID of the uploaded image.
  """
  # Initialize appropriate service.
  asset_service = client.GetService('AssetService', version='v201809')

  # Download the image.
  headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36'
    }
  session__ = HTMLSession()
  """ image_request = session__.get(url, headers=headers, verify=True)
  #print("URL: "+ url)
  print(image_request.content)
  print(image_request.html) """
  print(url)
  tab = url.split('&')
  print(type(url))
  image_request = session__.get(tab[0], headers=headers, verify=True)
  #print(tab[0])
  #image_asset = BytesIO(urlopen(tab[0]).read())
  image_asset = image_request.content
  print(image_asset)

  # Create the image asset.
  image_asset = {
      'xsi_type': 'ImageAsset',
      'imageData': image_asset,
      # This field is optional, and if provided should be unique.
      # 'assetName': 'Image asset ' + str(uuid.uuid4()),
  }

  # Create the operation.
  operation = {
      'operator': 'ADD',
      'operand': image_asset
  }

  # Create the asset and return the ID.
  result = asset_service.mutate([operation])
  
  print(result)
  try:
    source = tinify.tinify.tinify.from_url(result['value'][0]['fullSizeInfo']['imageUrl'])
    print(source)
    resized_image = source.resize(method="fit", width=300, height=250)
    data = resized_image.to_file(image_ref_on_file)
    print(sys.getsizeof(data))
    print(data)
  except:
      try:
        source = tinify.tinify.tinify.from_url(result['value'][0]['fullSizeInfo']['imageUrl'])
        source = tinify.tinify.tinify.from_url(result['value'][0]['fullSizeInfo']['imageUrl'])
        print(source)
        resized_image = source.resize(method="fit", width=300, height=250)
        data = resized_image.to_file(image_ref_on_file)
        print(sys.getsizeof(data))
        print(data)
      except:
          pass

  
   
   
  """ state = requests.get(url)
  im = Image.open(BytesIO(state.content))


  print(im.save('uploads/image.png'))
  url_ = url_for('uploaded_file', filename = 'image.png', _external = True)
  
  
  pngquant.config('../../uploads/')
  data = pngquant.quant_image(im) """
  
  return result['value'][0]['assetId']

def UpdateAd(client, ad_group_id, ad_id, data):
  # Initialize appropriate service.
  response = []
  operations = []
  finalUrls = []
  image = ""
  data_img = ""
  #print(data)
  print(ad_id)
  print(ad_group_id)
  for el in data:
    print(el)
      
    operations=[{
            'operator': 'SET',
            'operand': {
              'Ad.Type': 'ImageAd',
              'id': ad_id,
          el['field']: el['content']
        
        
            }
        }]
  



  print(operations)
  ad_group_ad_service = client.GetService('AdService', version='v201809')
  print(ad_group_ad_service)

  # Construct operations and update an ad.
 
  ads = ad_group_ad_service.mutate(operations)

  # Display results.
  for ad in ads['value']:
    print(ad['ad'])
    response.append({
        "status": "ok"
    })
    print ('Ad with id "%s" was updated.'% ad['ad']['id'])


  return response
  
  """ if len(data) == 2:
      if "image" in data[0]:
        image_name = data[0]['img_last_name'] + ".png"
        image_ref_on_file ='uploads/' +image_name
        UploadImageAsset(client, el['content'], image_ref_on_file)
        url_ = url_for('uploaded_file', filename=image_name, _external=True)
        data_img = urlopen(url_).read()
        print(data_img)
        operations.append({
            'operator': 'SET',
            'operand': {
            'adGroupId': ad_group_id,
            'ad': {
              'id': ad_id,
          },
          item['filed']: item['content']
        }
        })


  for el in data:
      if el['fieldAdwords'] == "image":
        image_name = el['img_last_name'] + ".png"
        image_ref_on_file ='uploads/' +image_name
        UploadImageAsset(client, el['content'], image_ref_on_file)
        url_ = url_for('uploaded_file', filename=image_name, _external=True)
        data_img = urlopen(url_).read()
        print(data_img)
      
   """

