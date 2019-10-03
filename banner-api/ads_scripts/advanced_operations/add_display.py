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

"""This example adds a responsive display ad to a given ad group.

To get ad_group_id, run get_ad_groups.py.

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

tinify.key = "mkXrWqhxCxjDHj8O0t8S5698DdY833Qo"



def UploadImageAsset(client, url, image_ref_on_file, image_name, width, height):
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
  #print(type(url))
  image_request = session__.get(tab[0], headers=headers, verify=True)
  #print(tab[0])
  #image_asset = BytesIO(urlopen(tab[0]).read())
  image_asset = image_request.content
  #print(image_asset)

  # Create the image asset.
  try:
    source = tinify.tinify.tinify.from_url(url)
    #print(source)
    resized_image = source.resize(method="fit", width=int(width), height=int(height))
    data = resized_image.to_file(image_ref_on_file)
    #print(sys.getsizeof(data))
    #print(data)
  except:
    try:
      source = tinify.tinify.tinify.from_url(url)
      print(source)
      resized_image = source.resize(method="fit", width=int(width), height=int(height))
      data = resized_image.to_file(image_ref_on_file)
      print(sys.getsizeof(data))
      #print(data)
    except Exception as e:
      print(e)
  print(image_name)
  file_url = url_for('uploaded_file', filename=image_name, _external=True)
  image_asset = {
      'xsi_type': 'ImageAsset',
      'imageData': urlopen(file_url).read(),
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
  #print(result)
  """ print(sys.getsizeof(result['value'][0]['fullSizeInfo']['imageUrl']))
  response = tinify.tinify.tinify.get_client().request('POST', '/shrink', {"source": {"url":result['value'][0]['fullSizeInfo']['imageUrl'] }})
  resultat = response.content.decode("utf-8") 
  json_obj = json.loads(resultat)
  print(json_obj["output"])
  size = 300, 250
  im = Image.open(BytesIO(requests.get(json_obj["output"]['url']).content))
  im.thumbnail(size, Image.ADAPTIVE)
  data = im.save('uploads/'+image_ref_on_file) """
  
   
   
  """ state = requests.get(url)
  im = Image.open(BytesIO(state.content))


  print(im.save('uploads/image.png'))
  url_ = url_for('uploaded_file', filename = 'image.png', _external = True)
  
  
  pngquant.config('../../uploads/')
  data = pngquant.quant_image(im) """
  
  return result['value'][0]['assetId']




def add_display_ad(client, ad_group_id, ad_name, image, finalUrls, finalAppsUrls, finalMobileUrls, width, height):
    print(finalAppsUrls)
    headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36'
    }
  
    #session__ = HTMLSession()
    #imgByteArr = io.BytesIO()
  # Initialize appropriate services.
    #print(ad_group_id)
    #print(ad_name)
    ad_group_ad_service = client.GetService('AdGroupAdService', version='v201809')
    print(ad_name)
    print(ad_group_id)
    image_name = ad_name + ".png"
    image_ref_on_file ='uploads/' +image_name
    meadiaId = UploadImageAsset(client, image, image_ref_on_file, image_name, width, height)
  
    
    response = []
    url_ = url_for('uploaded_file', filename=image_name, _external=True)
    data = urlopen(url_).read()
    print(data)

    
    
    if finalAppsUrls == []:
      print(finalUrls)
  #try:
    # Create a responsive display ad.
      operations = [{
          'operator': 'ADD',
          'operand': {
              'xsi_type': 'AdGroupAd',
              'adGroupId': ad_group_id,
              'ad': {
            'xsi_type': 'ImageAd',
            
          'name': ad_name,
        # This ad format does not allow the creation of an image asset by setting
        # the asset.imageData field. An image asset must first be created using
        # the AssetService, and asset.assetId must be populated when creating
        # the ad.
          'image': {
              'referenceId': meadiaId,
              'data':  data 
          },
          'finalUrls': final_url,
          'displayUrl': final_url,
        
          
          

              },
              # Optional fields.
              'status': 'PAUSED'
          }
          
      }
      
      for final_url in finalUrls
    
      ]

      # Make the mutate request.
      os.remove(image_ref_on_file)
      print('ads.......................................')
      ads = ad_group_ad_service.mutate(operations)
      print(ads)

      # Display results.
      for ad in ads['value']:
        print(['ad'])
        image_url = ""
        asset_image = ad['ad']['image']['urls']
        for item in asset_image:
          if (item['key'] == "FULL"):
            image_url = item['value']
        
          
        response.append({
          "ad_id": ad['ad']['id'],
          "name": ad['ad']['name'],
          "status": ad['status'],
          "displayUrl": ad['ad']['displayUrl'],
          "finalUrls": ad['ad']['finalUrls'],
          "finalMobileUrls": ad['ad']['finalMobileUrls'],
          "finalAppUrls": ad['ad']['finalAppUrls'],
          "automated": ad['ad']['automated'],
          "referenceId": ad['ad']['image']['referenceId'],
          "url_image": image_url  

        })
    else:
      operations = [{
          'operator': 'ADD',
          'operand': {
              'xsi_type': 'AdGroupAd',
              'adGroupId': ad_group_id,
              'ad': {
            'xsi_type': 'ImageAd',
            
          'name': ad_name,
        # This ad format does not allow the creation of an image asset by setting
        # the asset.imageData field. An image asset must first be created using
        # the AssetService, and asset.assetId must be populated when creating
        # the ad.
          'image': {
                'data':  data 
          },
          'finalUrls': final_url,
          'displayUrl': final_url,
         
          'finalAppUrls': {
            "url": app_url['item_id'], 
          'osType': 'UNKNOWN'
          }
          
          

              },
              # Optional fields.
              'status': 'PAUSED'
          }
          
      }
      for final_url in finalUrls
    
      for app_url in finalAppsUrls]

      # Make the mutate request.
      os.remove(image_ref_on_file)
      print('ads.......................................')
      ads = ad_group_ad_service.mutate(operations)
      print(ads)

      # Display results.
      for ad in ads['value']:
        print(ad['ad'])
        image_url = ""
        asset_image = ad['ad']['image']['urls']
        for item in asset_image:
          if (item['key'] == "FULL"):
            image_url = item['value']
            
        response.append({
          "ad_id": ad['ad']['id'],
          "name": ad['ad']['name'],
          "status": ad['status'],
          "displayUrl": ad['ad']['displayUrl'],
          "finalUrls": ad['ad']['finalUrls'],
          "finalMobileUrls": ad['ad']['finalMobileUrls'],
          "finalAppUrls": ad['ad']['finalAppUrls'],
          "automated": ad['ad']['automated'],
          "referenceId": ad['ad']['image']['referenceId'],
          "url_image":image_url

        })

        

 
    

    return response
    #raise Exception('Failed to create responsive display ad.')


