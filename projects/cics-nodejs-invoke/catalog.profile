#######################################################################
# Node.js application profile: basic_nodejsapp.profile                #
#                                                                     #
# The Node.js application profile is used to configure how CICS       #
# controls the Node.js runtime, provide Node.js command line options, #
# and to set environment variables for use by the application.        #
#                                                                     #
# Lines starting with # are treated as comments and ignored.          #
# Lines ending with \ are continued on the next line.                 #
#                                                                     #
# See topic "Node.js profile validation and properties"               #
# in the Knowledge Center:                                            #
# http://www.ibm.com/support/knowledgecenter/SSGMCP_5.5.0             #
#                                                                     #
#######################################################################
#                                                                     #
# Licensed Materials - Property of IBM                                #
#                                                                     #
# 5655-Y04  CICS Transaction Server                                   #
#                                                                     #
# (c) Copyright IBM Corporation 2018 All Rights Reserved              #
# US Government Users Restricted Rights - Use, duplication            #
# or disclosure restricted by GSA ADP Schedule Contract               #
# with IBM Corporation                                                #
#                                                                     #
#######################################################################
#
#                      Symbol Substitution
#                      -------------------
#
# Symbols are replaced with their value when the profile is read by
# CICS. They are useful to avoid duplicating configuration in the
# profile. Symbols start with & and end with ; characters. Environment
# variables defined in the profile may also be used as symbols.
#
# The following symbols are provided:
#   &APPLID;     => Applid of the CICS region.
#   &BUNDLE;     => Name of the BUNDLE resource.
#   &BUNDLEID;   => Bundle ID.
#   &CONFIGROOT; => Directory of the .nodejsapp CICS bundle part.
#   &DATE;       => Date when the NODEJSAPP resource is enabled
#                   (localtime), formatted as Dyymmdd.
#   &NODEJSAPP;  => Name of the NODEJSAPP resource.
#   &TIME;       => Time when the NODEJSAPP resource is enabled
#                   (localtime), formatted as Thhmmss.
#   &USSCONFIG;  => Value of the USSCONFIG SIT parameter.
#   &USSHOME;    => Value of the USSHOME SIT parameter.
#
# Examples:
# LOG_DIR=&WORK_DIR;/&APPLID;/&BUNDLEID;/&NODEJSAPP;
# LOG_SUCCESS=&LOG_DIR;/success.txt
# LOG_FAILURE=&LOG_DIR;/failure.txt
#
#**********************************************************************
#
#                      Required parameters
#                      -------------------
#
# NODE_HOME specifies the location of IBM SDK for Node.js - z/OS.
#
# NODE_HOME=/usr/lpp/IBM/cnj/IBM/node-v6.14.4-os390-s390x
#
#
# WORK_DIR specifies the root directory in which CICS will create log
# files. The default value is /tmp. A value of . means the home
# directory of the user id running the CICS job.
#
# WORK_DIR=.
#
#**********************************************************************
#
#                      Including files in the profile
#                      ------------------------------
#
# %INCLUDE specifies a file to be included in this profile. The file can
# contain common system-wide configuration that can then be maintained
# separate to the application configuration. Symbols can be used when
# specifying the file to be included.
#
# Examples:
# %INCLUDE=/etc/cicsts/prodplex/nodejs/sdk.profile
# %INCLUDE=&USSCONFIG;/nodejs/sdk.profile
# %INCLUDE=&CONFIGROOT;/debug.profile

# This file should created on zFS and must contain WORK_DIR and NODE_HOME
%INCLUDE=&USSCONFIG;/nodejsprofiles/general.profile

#**********************************************************************
#
#                      Optional parameters
#                      -------------------
#
# NODEJSAPP_DISABLE_TIMEOUT specifies the time in milliseconds that
# CICS will wait when attempting to disable a NODEJSAPP. If the process
# has not terminated in this time then CICS will send a SIGKILL signal
# to force the process to end. The default value is 10000 (10 seconds).
#
# Example:
# NODEJSAPP_DISABLE_TIMEOUT=30000
#
#**********************************************************************
#
#                      Environment variables
#                      ---------------------
#
# Environment variables will be set before CICS starts the Node.js
# runtime. Use environment variables to pass configuration to the
# Node.js application.
#
# Example:
PORT=3000
#
#**********************************************************************
#
#                      Command line options
#                      --------------------
#
# Options beginning with a hyphen will be included on the command line
# when CICS starts the Node.js runtime. The command line options
# accepted by Node.js are documented at:
# https://nodejs.org/dist/latest-v6.x/docs/api/cli.html
#
# Example:
# --trace-sync-io
#
#**********************************************************************
#
#              Unix System Services Environment Variables
#              ------------------------------------------
#
# TZ specifies the local time zone in POSIX format in which the Node.js
# application will run.
#
# Example:
# TZ=CET-1CEST,M3.5.0,M10.5.0
#
#**********************************************************************
