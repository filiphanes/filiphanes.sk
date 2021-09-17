---
date: "2021-09-07T21:30:00+02:00"
title: "WORM storage ideas"
tags: ["post", "storage", "filesystem"]
thumbnail: "/img/streaming.jpg"
draft: true
---

# Ideas
- write raw data sequentially, because sequential write is fastest on both rotating and flash drives
- store raw data and meta data on different devices (raw on HDD, meta on SSD)
- don't move file inside 1 drive, read from first and write to second, so both can go sequentially and HDD heads don't jump
- meta data are small so they can be heavily cached in RAM and replicated simple by copy
- raw data are large and benefits from erasure codes
- sequential write can write only 1 stream so man slow uploaders needs to be buffered in RAM and write only full blocks
- free space between holes moving files to other writing drive, this serves as data scrubbing and fixes bitrot
- write drive to full and then allow reads, if in the mean time reads can be served from other drive
- sequential writes utilizes SMR drives
- sequential reads/writes don't vibrate drives, so potentially prolongs their life
