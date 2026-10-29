import { useState, useMemo, useCallback } from 'react'
import {
  facilityService,
  criterionService,
  assessmentService,
  observationService,
  assessmentRuleService,
  reportService,
  getEvidenceForObservation,
} from '../services/dataStore.js'
import { loadInitialData } from '../data/index.js'
import { NEED_GROUP } from '../domain/constants.js'
import { createBarrierReport } from '../domain/models.js'
import {
  getRelevantCriteria,
  getLatestObservations,
  summarizeAssessment,
  buildFacilityDetailReport,
} from '../domain/assessmentEngine.js'
import { AccessibilityContext } from './accessibilityContextDef.js'

function getInitialStoreState() {
  let existingFacilities = facilityService.getAll()
  if (!existingFacilities || existingFacilities.length === 0) {
    loadInitialData({ clearFirst: false })
    existingFacilities = facilityService.getAll()
  }
  return {
    facilities: existingFacilities,
    criteria: criterionService.getAll(),
    rules: assessmentRuleService.getAll(),
    reports: reportService.getAll(),
  }
}

export function AccessibilityProvider({ children }) {
  const [storeState, setStoreState] = useState(getInitialStoreState)
  const [selectedNeeds, setSelectedNeeds] = useState([NEED_GROUP.MOBILITY])

  const reloadData = useCallback(() => {
    setStoreState({
      facilities: facilityService.getAll(),
      criteria: criterionService.getAll(),
      rules: assessmentRuleService.getAll(),
      reports: reportService.getAll(),
    })
  }, [])

  const resetData = useCallback(() => {
    loadInitialData({ clearFirst: true })
    reloadData()
  }, [reloadData])

  const addReport = useCallback((reportData) => {
    const report = createBarrierReport(reportData)
    reportService.save(report)
    setStoreState((prev) => ({
      ...prev,
      reports: reportService.getAll(),
    }))
    return report
  }, [])

  const getReportsByFacilityId = useCallback(
    (facilityId) => {
      return storeState.reports.filter((r) => r.facilityId === facilityId)
    },
    [storeState.reports],
  )

  const toggleNeed = useCallback((need) => {
    setSelectedNeeds((prev) => {
      if (prev.includes(need)) {
        if (prev.length === 1) return prev
        return prev.filter((n) => n !== need)
      }
      return [...prev, need]
    })
  }, [])

  const userProfile = useMemo(() => ({ selectedNeeds }), [selectedNeeds])

  const getFacilitySummary = useCallback(
    (facilityId) => {
      const facility = storeState.facilities.find((f) => f.id === facilityId)
      if (!facility) return null

      const relevant = getRelevantCriteria(
        storeState.criteria,
        userProfile,
        facility.type,
      )
      const criterionIds = relevant.map((c) => c.id)

      const observations = observationService.getAll()
      const assessments = assessmentService.getAll()

      const observationMap = getLatestObservations(
        observations,
        assessments,
        facilityId,
        criterionIds,
      )

      return summarizeAssessment(
        relevant,
        observationMap,
        storeState.rules,
        userProfile,
      )
    },
    [storeState.facilities, storeState.criteria, storeState.rules, userProfile],
  )

  const getFacilityById = useCallback(
    (facilityId) => {
      return storeState.facilities.find((f) => f.id === facilityId) || null
    },
    [storeState.facilities],
  )

  const getFacilityDetailReport = useCallback(
    (facilityId) => {
      const facility = getFacilityById(facilityId)
      if (!facility) return null

      return buildFacilityDetailReport({
        facility,
        criteria: storeState.criteria,
        assessments: assessmentService.getAll(),
        observations: observationService.getAll(),
        rules: storeState.rules,
        userProfile,
        getEvidenceFn: getEvidenceForObservation,
      })
    },
    [getFacilityById, storeState.criteria, storeState.rules, userProfile],
  )

  const value = useMemo(
    () => ({
      facilities: storeState.facilities,
      criteria: storeState.criteria,
      rules: storeState.rules,
      reports: storeState.reports,
      selectedNeeds,
      userProfile,
      toggleNeed,
      getFacilitySummary,
      getFacilityById,
      getFacilityDetailReport,
      addReport,
      getReportsByFacilityId,
      resetData,
      reloadData,
    }),
    [
      storeState.facilities,
      storeState.criteria,
      storeState.rules,
      storeState.reports,
      selectedNeeds,
      userProfile,
      toggleNeed,
      getFacilitySummary,
      getFacilityById,
      getFacilityDetailReport,
      addReport,
      getReportsByFacilityId,
      resetData,
      reloadData,
    ],
  )

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}
