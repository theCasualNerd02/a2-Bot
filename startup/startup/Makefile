#
#  Makefile
#  Apple2BuildPipelineSample
#
#  Part of a sample build pipeline for Apple II software development
#
#  Created by Quinn Dunki on 8/15/14.
#  One Girl, One Laptop Productions
#  http://www.quinndunki.com
#  http://www.quinndunki.com/blondihacks
#

include make/head.mk

# Customize this file to control what gets built, what machines to
# target, where in memory to put it, etc.

# The name of your system or binary file to build goes here:
PGM=startup

# These are special machine definitions beyond those defined in cc65
# which are used for BASIC projects:
MACHINE = apple2-basic
#    MACHINE = apple2-dos33-basic

# Add any other directories where you are putting other BASIC files 
# to this list.  Note that if you are generating source files into
# $(GENDIR), you should add $(GENDIR) to SRCDIRS here:
SRCDIRS+=

# If you want to add arguments to the BASIC tokenizer commandline,
# add them to this valiable:
#    BASICFLAGS += --optimize

# If you have java installed in a non-standard location, you can set
# the path to it by uncommenting the following line:
#    export JAVA=/usr/bin/java

# If you want to copy one or more files or directories to the target disk
# image, add the root directory to this variable.  All files will be
# copied from the source to the target using the same path from the source.
#
# For example, if you set COPYDIRS to dir and in your project you have
# the following files:
#     dir/mySystemFile
#     dir/newDir/anotherFile
#
# Then, during the copy phase, mySystemFile will be copied into the root
# of the disk and anotherFile will be copied into a directory named
# newDir.  The newDir directory will be created if it does not already
# exist.
#
# The name of the file to copy is checked and if it ends in:
#     .as - It assumes the file is in AppleSingle format.  The .as
#           suffix is stripped from the name when copied to the
# 	    disk image.
# .<char> - If the file ends with a single character which matches
#           a DOS 3.3 file type (A, B, T, etc) it uses that value as
#           the file type of the file copied to the disk image.  The
#           single character is removed from the file name.
#  .<TLA> - If the file ends with a three letter alpha extension, it
#           uses that TLA as the file type of the file copied to the
#           disk image.  The TLA is removed from the file name.
#
# If you do not provide any type information for your filenames,
# it will be copied as a binary.
#
COPYDIRS=

# Add any rules you want to execute before any compiles or assembly
# commands are called here, if any.  You can generate .c, .s or .h
# files for example.  You can generate data files.  Whatever you
# might need.
#
# You should generate these files in the $(GENDIR) directory or
# within a subdirectory under $(GENDIR) which you create yourself.
#
# All of your commands associated with a rule _must_ start with a tab
# character.  Xcode makes it a bit tough to type a tab character by
# default.  Press option-tab within Xcode to insert a tab character.
gen:

# For any files you generated in the gen target above, you should
# add rules in genclean to remove those generated files when you
# clean your build.
genclean:

# Do not change anything else below here...
include make/tail.mk
